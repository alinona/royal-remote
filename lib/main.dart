// ═══════════════════════════════════════════════
// 👑 Royal Remote - التحكم بالرسيفر عبر البلوتوث
// ═══════════════════════════════════════════════
import 'dart:async';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bluetooth_serial/flutter_bluetooth_serial.dart';

// ─────────────────────────────────
// 🚀 نقطة البداية
// ─────────────────────────────────
void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Color(0xFF0A0A0A),
    ),
  );
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
  runApp(const RoyalRemoteApp());
}

class RoyalRemoteApp extends StatelessWidget {
  const RoyalRemoteApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Royal Remote',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0D0D0D),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF42A5F5),
          secondary: Color(0xFFFF9800),
          surface: Color(0xFF1A1A1A),
        ),
      ),
      home: const HomeScreen(),
    );
  }
}

// ─────────────────────────────────
// 🎨 الألوان الثابتة
// ─────────────────────────────────
class C {
  static const bg = Color(0xFF0D0D0D);
  static const surface = Color(0xFF1A1A1A);
  static const surfaceL = Color(0xFF252525);
  static const card = Color(0xFF1E1E1E);
  static const border = Color(0xFF333333);
  static const red = Color(0xFFE53935);
  static const blue = Color(0xFF42A5F5);
  static const green = Color(0xFF66BB6A);
  static const yellow = Color(0xFFFDD835);
  static const orange = Color(0xFFFF9800);
  static const btnFace = Color(0xFF2A2A2A);
  static const netflix = Color(0xFFE50914);
  static const youtube = Color(0xFFFF0000);
}

// ─────────────────────────────────
// 📡 أكواد الأوامر
// ─────────────────────────────────
class Cmd {
  static const power = 0x00, mute = 0x01;
  static const volUp = 0x02, volDown = 0x03;
  static const chUp = 0x04, chDown = 0x05;
  static const up = 0x10, down = 0x11, left = 0x12, right = 0x13, ok = 0x14;
  static const n0=0x20, n1=0x21, n2=0x22, n3=0x23, n4=0x24;
  static const n5=0x25, n6=0x26, n7=0x27, n8=0x28, n9=0x29;
  static const cRed=0x30, cGreen=0x31, cYellow=0x32, cBlue=0x33;
  static const menu=0x40, info=0x41, exit_=0x42, list_=0x43;
  static const epg=0x44, text_=0x45, rec=0x46, audio=0x47, source=0x48;
  static const nflix=0x50, ytube=0x51;
  static const mLeft=0x60, mRight=0x61;
}

// ─────────────────────────────────
// 📡 خدمة البلوتوث
// ─────────────────────────────────
enum BtState { off, connecting, on, error }

class BtService extends ChangeNotifier {
  FlutterBluetoothSerial bt = FlutterBluetoothSerial.instance;
  BluetoothConnection? _conn;
  BtState state = BtState.off;
  List<BluetoothDevice> devices = [];
  BluetoothDevice? device;
  String msg = 'غير متصل';

  bool get connected => state == BtState.on;

  Future<void> init() async {
    try {
      bool? on = await bt.isEnabled;
      if (on != true) await bt.requestEnable();
      await scan();
    } catch (_) {
      msg = 'فعّل البلوتوث';
      notifyListeners();
    }
  }

  Future<void> scan() async {
    try {
      devices = await bt.getBondedDevices();
      notifyListeners();
    } catch (_) {}
  }

  Future<bool> connectTo(BluetoothDevice d) async {
    state = BtState.connecting;
    msg = 'جارٍ الاتصال...';
    notifyListeners();
    try {
      _conn = await BluetoothConnection.toAddress(d.address)
          .timeout(const Duration(seconds: 10));
      device = d;
      state = BtState.on;
      msg = 'متصل ✓';
      notifyListeners();
      _conn!.input?.listen(null)?.onDone(() => disconnect());
      return true;
    } catch (e) {
      state = BtState.error;
      msg = 'فشل الاتصال';
      notifyListeners();
      Future.delayed(const Duration(seconds: 2), () {
        state = BtState.off;
        msg = 'حاول مرة أخرى';
        notifyListeners();
      });
      return false;
    }
  }

  Future<void> disconnect() async {
    try { await _conn?.close(); } catch (_) {}
    _conn = null; device = null;
    state = BtState.off; msg = 'تم القطع';
    notifyListeners();
  }

  void send(int code) {
    if (_conn == null || !connected) return;
    try {
      final data = Uint8List.fromList(
        [0xAA, 0x01, code, (0x01 + code) & 0xFF, 0x55]
      );
      _conn!.output.add(data);
      _conn!.output.allSent;
    } catch (_) {}
  }

  void sendMouse(int dx, int dy) {
    if (_conn == null || !connected) return;
    try {
      int x = dx.clamp(-127,127) & 0xFF;
      int y = dy.clamp(-127,127) & 0xFF;
      final data = Uint8List.fromList(
        [0xAA, 0x02, x, y, (0x02+x+y) & 0xFF, 0x55]
      );
      _conn!.output.add(data);
    } catch (_) {}
  }

  void sendScroll(int s) {
    if (_conn == null || !connected) return;
    try {
      int sb = s.clamp(-127,127) & 0xFF;
      final data = Uint8List.fromList(
        [0xAA, 0x03, sb, (0x03+sb) & 0xFF, 0x55]
      );
      _conn!.output.add(data);
    } catch (_) {}
  }

  @override
  void dispose() { disconnect(); super.dispose(); }
}

// ─────────────────────────────────
// 🏠 الشاشة الرئيسية
// ─────────────────────────────────
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _page = 0;
  final _bt = BtService();

  @override
  void initState() {
    super.initState();
    _bt.init();
    _bt.addListener(() => setState(() {}));
  }

  @override
  void dispose() { _bt.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    final pages = [
      _ControlPage(bt: _bt),
      _NumpadPage(bt: _bt),
      _ColorsPage(bt: _bt),
      _AppsPage(bt: _bt),
      _ExtraPage(bt: _bt),
      _MousePage(bt: _bt),
    ];

    return Scaffold(
      extendBody: true,
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter, end: Alignment.bottomCenter,
            colors: [Color(0xFF1A1A2E), Color(0xFF0D0D0D)],
          ),
        ),
        child: SafeArea(
          bottom: false,
          child: Column(
            children: [
              _buildTopBar(),
              Expanded(
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  child: pages[_page],
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: _buildNav(),
    );
  }

  Widget _buildTopBar() {
    Color sc = _bt.connected ? C.green
        : _bt.state == BtState.connecting ? C.orange
        : _bt.state == BtState.error ? C.red : Colors.grey;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          GestureDetector(
            onTap: () => _showBtSheet(),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: sc.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: sc.withOpacity(0.3)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    _bt.connected ? Icons.bluetooth_connected
                        : Icons.bluetooth, color: sc, size: 18,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    _bt.connected ? (_bt.device?.name ?? 'متصل') : 'اتصال',
                    style: TextStyle(color: sc, fontSize: 13,
                        fontWeight: FontWeight.w600),
                  ),
                ],
              ),
            ),
          ),
          const Spacer(),
          const Text('👑 ROYAL',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold,
              color: Color(0xFFD4AF37), letterSpacing: 2),
          ),
          const Spacer(),
          const SizedBox(width: 80),
        ],
      ),
    );
  }

  Widget _buildNav() {
    final items = [
      (Icons.gamepad_rounded, 'تحكم'),
      (Icons.dialpad_rounded, 'أرقام'),
      (Icons.palette_rounded, 'ألوان'),
      (Icons.apps_rounded, 'تطبيقات'),
      (Icons.tune_rounded, 'إضافي'),
      (Icons.mouse_rounded, 'ماوس'),
    ];
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF0A0A0A).withOpacity(0.95),
        border: Border(top: BorderSide(color: Colors.white.withOpacity(0.05))),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 6),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: List.generate(items.length, (i) {
              final sel = i == _page;
              return GestureDetector(
                onTap: () => setState(() => _page = i),
                behavior: HitTestBehavior.opaque,
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                  decoration: BoxDecoration(
                    color: sel ? C.blue.withOpacity(0.1) : Colors.transparent,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(items[i].$1,
                        color: sel ? C.blue : Colors.white38, size: 22),
                      const SizedBox(height: 3),
                      Text(items[i].$2,
                        style: TextStyle(
                          color: sel ? C.blue : Colors.white30,
                          fontSize: 10,
                          fontWeight: sel ? FontWeight.bold : FontWeight.normal,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }

  void _showBtSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF1A1A1A),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (_) => _BtSheet(bt: _bt),
    );
  }
}

// ─────────────────────────────────
// 📡 شاشة البلوتوث
// ─────────────────────────────────
class _BtSheet extends StatefulWidget {
  final BtService bt;
  const _BtSheet({required this.bt});
  @override
  State<_BtSheet> createState() => _BtSheetState();
}

class _BtSheetState extends State<_BtSheet> {
  @override
  void initState() {
    super.initState();
    widget.bt.addListener(_r);
    widget.bt.scan();
  }
  void _r() { if(mounted) setState(() {}); }
  @override
  void dispose() { widget.bt.removeListener(_r); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(width: 40, height: 4, margin: const EdgeInsets.only(bottom: 16),
            decoration: BoxDecoration(color: Colors.white24,
              borderRadius: BorderRadius.circular(2)),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('📡 البلوتوث',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              if (widget.bt.connected)
                TextButton(onPressed: () {
                  widget.bt.disconnect(); Navigator.pop(context);
                }, child: const Text('قطع', style: TextStyle(color: Colors.red))),
            ],
          ),
          const SizedBox(height: 4),
          Text(widget.bt.msg,
            style: TextStyle(
              color: widget.bt.connected ? C.green : Colors.white54,
              fontSize: 13)),
          const SizedBox(height: 16),
          if (widget.bt.devices.isEmpty)
            const Padding(
              padding: EdgeInsets.all(20),
              child: Text('لا توجد أجهزة مقترنة\nاقرن الرسيفر من الإعدادات أولاً',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white38)),
            )
          else
            ...widget.bt.devices.map((d) => ListTile(
              leading: Icon(
                widget.bt.device?.address == d.address
                    ? Icons.bluetooth_connected : Icons.bluetooth,
                color: widget.bt.device?.address == d.address
                    ? C.green : Colors.white54,
              ),
              title: Text(d.name ?? 'غير معروف',
                style: const TextStyle(fontWeight: FontWeight.w600)),
              subtitle: Text(d.address,
                style: const TextStyle(color: Colors.white38, fontSize: 12)),
              trailing: widget.bt.state == BtState.connecting
                  ? const SizedBox(width: 20, height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2))
                  : widget.bt.device?.address == d.address
                      ? const Icon(Icons.check_circle, color: C.green)
                      : const Icon(Icons.arrow_forward_ios,
                          size: 16, color: Colors.white24),
              onTap: () async {
                if (widget.bt.connected) return;
                final ok = await widget.bt.connectTo(d);
                if (ok && mounted) Navigator.pop(context);
              },
            )),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: () => widget.bt.scan(),
              icon: const Icon(Icons.refresh),
              label: const Text('تحديث'),
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.white54,
                side: const BorderSide(color: Colors.white24),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
          SizedBox(height: MediaQuery.of(context).padding.bottom + 12),
        ],
      ),
    );
  }
}

// ─────────────────────────────────
// 🔘 زر ريموت عام
// ─────────────────────────────────
class RBtn extends StatefulWidget {
  final String label;
  final IconData? icon;
  final VoidCallback onTap;
  final Color color;
  final Color? glow;
  final Color textColor;
  final double w, h, fs, is_;
  final bool circle;

  const RBtn({super.key,
    required this.label, this.icon, required this.onTap,
    this.color = C.btnFace, this.glow, this.textColor = Colors.white,
    this.w = 70, this.h = 56, this.fs = 12, this.is_ = 24,
    this.circle = false,
  });

  @override
  State<RBtn> createState() => _RBtnState();
}

class _RBtnState extends State<RBtn> {
  bool _p = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) { setState(() => _p = true); HapticFeedback.lightImpact(); },
      onTapUp: (_) { setState(() => _p = false); widget.onTap(); },
      onTapCancel: () => setState(() => _p = false),
      child: AnimatedScale(
        scale: _p ? 0.92 : 1.0,
        duration: const Duration(milliseconds: 100),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          width: widget.circle ? widget.w : widget.w,
          height: widget.circle ? widget.w : widget.h,
          decoration: BoxDecoration(
            color: _p ? widget.color.withOpacity(0.7) : widget.color,
            shape: widget.circle ? BoxShape.circle : BoxShape.rectangle,
            borderRadius: widget.circle ? null : BorderRadius.circular(16),
            border: Border.all(
              color: _p ? (widget.glow?.withOpacity(0.6) ?? Colors.white30)
                  : (widget.glow?.withOpacity(0.2) ?? Colors.white10),
            ),
            boxShadow: [
              if (widget.glow != null)
                BoxShadow(
                  color: widget.glow!.withOpacity(_p ? 0.5 : 0.15),
                  blurRadius: _p ? 20 : 8,
                ),
              BoxShadow(
                color: Colors.black.withOpacity(0.5),
                blurRadius: _p ? 2 : 8,
                offset: Offset(0, _p ? 1 : 4),
              ),
            ],
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: [
              if (widget.icon != null)
                Icon(widget.icon, color: widget.textColor, size: widget.is_),
              if (widget.icon != null) const SizedBox(height: 2),
              Text(widget.label,
                style: TextStyle(color: widget.textColor,
                  fontSize: widget.fs, fontWeight: FontWeight.w600),
                textAlign: TextAlign.center, maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ─────────────────────────────────
// 🎡 عجلة التمرير
// ─────────────────────────────────
class ScrollWheel extends StatefulWidget {
  final Function(int) onScroll;
  final double w, h;
  const ScrollWheel({super.key,
    required this.onScroll, this.w = 50, this.h = 140});
  @override
  State<ScrollWheel> createState() => _ScrollWheelState();
}

class _ScrollWheelState extends State<ScrollWheel> {
  double _off = 0, _total = 0;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onVerticalDragUpdate: (d) {
        setState(() { _off += d.delta.dy; _total += d.delta.dy; });
        if (_total.abs() >= 30) {
          widget.onScroll(_total > 0 ? -1 : 1);
          HapticFeedback.selectionClick();
          _total = 0;
        }
      },
      onVerticalDragEnd: (_) => _total = 0,
      child: Container(
        width: widget.w, height: widget.h,
        decoration: BoxDecoration(
          color: C.surface,
          borderRadius: BorderRadius.circular(widget.w / 2),
          border: Border.all(color: Colors.white12),
          boxShadow: const [BoxShadow(color: Colors.black54, blurRadius: 10)],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(widget.w / 2),
          child: CustomPaint(
            painter: _WheelPainter(_off),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Padding(padding: const EdgeInsets.only(top: 10),
                  child: Icon(Icons.keyboard_arrow_up,
                    color: Colors.white.withOpacity(0.4), size: 20)),
                Icon(Icons.swipe_vertical,
                  color: Colors.white.withOpacity(0.15), size: 18),
                Padding(padding: const EdgeInsets.only(bottom: 10),
                  child: Icon(Icons.keyboard_arrow_down,
                    color: Colors.white.withOpacity(0.4), size: 20)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _WheelPainter extends CustomPainter {
  final double off;
  _WheelPainter(this.off);
  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()..color = Colors.white.withOpacity(0.06)..strokeWidth = 1;
    double s = off % 12;
    for (double y = s; y < size.height; y += 12) {
      double cd = (y - size.height/2).abs() / (size.height/2);
      double lw = size.width * 0.6 * (1 - cd * 0.4);
      double xs = (size.width - lw) / 2;
      canvas.drawLine(Offset(xs, y), Offset(xs + lw, y), p);
    }
  }
  @override
  bool shouldRepaint(covariant _WheelPainter o) => o.off != off;
}

// ─────────────────────────────────
// ⬛ ديكور الريموت
// ─────────────────────────────────
BoxDecoration remoteBox() => BoxDecoration(
  gradient: const LinearGradient(
    begin: Alignment.topCenter, end: Alignment.bottomCenter,
    colors: [Color(0xFF2A2A2A), Color(0xFF1A1A1A), Color(0xFF151515)],
  ),
  borderRadius: BorderRadius.circular(40),
  border: Border.all(color: const Color(0xFF3A3A3A), width: 1.5),
  boxShadow: const [
    BoxShadow(color: Colors.black87, blurRadius: 30, spreadRadius: 5,
      offset: Offset(0, 10)),
  ],
);

// ═══════════════════════════════════════
// 📄 صفحة 1: التحكم الأساسي
// ═══════════════════════════════════════
class _ControlPage extends StatefulWidget {
  final BtService bt;
  const _ControlPage({required this.bt});
  @override
  State<_ControlPage> createState() => _ControlPageState();
}

class _ControlPageState extends State<_ControlPage> {
  double _vol = 50;
  bool _muted = false;
  bool _touching = false;
  String _dir = '';

  void _s(int c) => widget.bt.send(c);

  @override
  Widget build(BuildContext context) {
    final w = MediaQuery.of(context).size.width * 0.92;
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      child: Center(
        child: Container(
          width: w,
          margin: const EdgeInsets.symmetric(vertical: 16),
          padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
          decoration: remoteBox(),
          child: Column(children: [
            // ═══ الباور + الشعار + الصامت ═══
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                RBtn(label: _muted ? 'مكتوم' : 'صامت',
                  icon: _muted ? Icons.volume_off : Icons.volume_up,
                  onTap: () { setState(() => _muted = !_muted); _s(Cmd.mute); },
                  color: _muted ? Colors.red.shade900 : C.btnFace,
                  glow: _muted ? C.red : null,
                  w: 62, h: 62, circle: true, fs: 9, is_: 22),

                const Column(children: [
                  Text('👑', style: TextStyle(fontSize: 28)),
                  SizedBox(height: 4),
                  Text('ROYAL', style: TextStyle(fontSize: 18,
                    fontWeight: FontWeight.bold, letterSpacing: 4,
                    color: Color(0xFFD4AF37))),
                ]),

                RBtn(label: 'تشغيل',
                  icon: Icons.power_settings_new,
                  onTap: () => _s(Cmd.power),
                  color: const Color(0xFF3D1111), glow: C.red,
                  textColor: C.red,
                  w: 62, h: 62, circle: true, fs: 9, is_: 26),
              ],
            ),
            const SizedBox(height: 20),

            // ═══ التاتشباد + عجلات ═══
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // عجلة الصوت
                Column(children: [
                  Text('VOL', style: TextStyle(
                    color: Colors.white.withOpacity(0.3), fontSize: 10,
                    fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  ScrollWheel(w: 44, h: 130, onScroll: (d) {
                    if (d > 0) { _s(Cmd.volUp); setState(() => _vol = (_vol+2).clamp(0,100)); }
                    else { _s(Cmd.volDown); setState(() => _vol = (_vol-2).clamp(0,100)); }
                  }),
                ]),
                const SizedBox(width: 8),

                // التاتشباد الدائري
                _buildTouchpad(),

                const SizedBox(width: 8),
                // عجلة القنوات
                Column(children: [
                  Text('CH', style: TextStyle(
                    color: Colors.white.withOpacity(0.3), fontSize: 10,
                    fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  ScrollWheel(w: 44, h: 130, onScroll: (d) {
                    if (d > 0) _s(Cmd.chUp); else _s(Cmd.chDown);
                  }),
                ]),
              ],
            ),
            const SizedBox(height: 16),

            // ═══ أزرار الصوت والقنوات ═══
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                RBtn(label: 'VOL-', icon: Icons.remove, w: 70, h: 44,
                  glow: C.blue, is_: 18, fs: 10,
                  onTap: () { _s(Cmd.volDown); setState(() => _vol = (_vol-5).clamp(0,100)); }),
                RBtn(label: 'VOL+', icon: Icons.add, w: 70, h: 44,
                  glow: C.blue, is_: 18, fs: 10,
                  onTap: () { _s(Cmd.volUp); setState(() => _vol = (_vol+5).clamp(0,100)); }),
                const SizedBox(width: 12),
                RBtn(label: 'CH-', icon: Icons.remove, w: 70, h: 44,
                  glow: C.green, is_: 18, fs: 10,
                  onTap: () => _s(Cmd.chDown)),
                RBtn(label: 'CH+', icon: Icons.add, w: 70, h: 44,
                  glow: C.green, is_: 18, fs: 10,
                  onTap: () => _s(Cmd.chUp)),
              ],
            ),
            const SizedBox(height: 12),

            // ═══ شريط الصوت ═══
            Row(children: [
              Icon(_muted ? Icons.volume_off : Icons.volume_up,
                color: C.blue.withOpacity(0.7), size: 18),
              const SizedBox(width: 8),
              Expanded(
                child: SliderTheme(
                  data: SliderThemeData(
                    activeTrackColor: C.blue,
                    inactiveTrackColor: C.surfaceL,
                    thumbColor: C.blue,
                    overlayColor: C.blue.withOpacity(0.2),
                    trackHeight: 6,
                    thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 8),
                  ),
                  child: Slider(
                    value: _muted ? 0 : _vol, min: 0, max: 100,
                    onChanged: (v) {
                      setState(() { _vol = v; _muted = false; });
                      HapticFeedback.selectionClick();
                    },
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Text('${_vol.round()}',
                style: TextStyle(color: Colors.white.withOpacity(0.5),
                  fontSize: 12, fontWeight: FontWeight.bold)),
            ]),
            const SizedBox(height: 12),

            // ═══ أزرار سريعة ═══
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                RBtn(label: 'القائمة', icon: Icons.menu, w: 68, h: 50,
                  fs: 10, is_: 20, onTap: () => _s(Cmd.menu)),
                RBtn(label: 'معلومات', icon: Icons.info_outline, w: 68, h: 50,
                  fs: 10, is_: 20, onTap: () => _s(Cmd.info)),
                RBtn(label: 'خروج', icon: Icons.exit_to_app, w: 68, h: 50,
                  fs: 10, is_: 20, glow: C.orange, onTap: () => _s(Cmd.exit_)),
                RBtn(label: 'المصدر', icon: Icons.input, w: 68, h: 50,
                  fs: 10, is_: 20, onTap: () => _s(Cmd.source)),
              ],
            ),
          ]),
        ),
      ),
    );
  }

  Widget _buildTouchpad() {
    Offset? start;
    return SizedBox(
      width: 240, height: 240,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // أسهم الاتجاهات
          Positioned(top: 0, child: _arrowBtn(Icons.keyboard_arrow_up, 'up')),
          Positioned(bottom: 0, child: _arrowBtn(Icons.keyboard_arrow_down, 'down')),
          Positioned(left: 0, child: _arrowBtn(Icons.keyboard_arrow_left, 'left')),
          Positioned(right: 0, child: _arrowBtn(Icons.keyboard_arrow_right, 'right')),

          // منطقة اللمس
          GestureDetector(
            onPanStart: (d) { start = d.localPosition; setState(() => _touching = true); },
            onPanUpdate: (d) {
              if (start == null) return;
              final dx = d.localPosition.dx - start!.dx;
              final dy = d.localPosition.dy - start!.dy;
              if (dx*dx + dy*dy > 400) {
                String nd;
                if (dx.abs() > dy.abs()) { nd = dx > 0 ? 'right' : 'left'; }
                else { nd = dy > 0 ? 'down' : 'up'; }
                if (nd != _dir) {
                  setState(() => _dir = nd);
                  HapticFeedback.selectionClick();
                  switch(nd) {
                    case 'up': _s(Cmd.up);
                    case 'down': _s(Cmd.down);
                    case 'left': _s(Cmd.left);
                    case 'right': _s(Cmd.right);
                  }
                  start = d.localPosition;
                }
              }
            },
            onPanEnd: (_) => setState(() { _touching = false; _dir = ''; }),
            onTap: () { HapticFeedback.mediumImpact(); _s(Cmd.ok); },
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 150),
              width: 170, height: 170,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: _touching ? C.surfaceL : C.surface,
                border: Border.all(
                  color: _touching ? C.blue.withOpacity(0.5) : Colors.white12,
                  width: 2),
                boxShadow: [
                  if (_touching) BoxShadow(
                    color: C.blue.withOpacity(0.2), blurRadius: 20),
                  const BoxShadow(color: Colors.black45, blurRadius: 15,
                    offset: Offset(0, 5)),
                ],
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.touch_app, color: Colors.white.withOpacity(0.15), size: 28),
                  const SizedBox(height: 4),
                  Text('OK', style: TextStyle(
                    color: Colors.white.withOpacity(_touching ? 0.8 : 0.3),
                    fontSize: 22, fontWeight: FontWeight.bold, letterSpacing: 2)),
                  Text('اسحب للتنقل', style: TextStyle(
                    color: Colors.white.withOpacity(0.15), fontSize: 9)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _arrowBtn(IconData icon, String dir) {
    bool active = _dir == dir;
    return GestureDetector(
      onTap: () {
        HapticFeedback.lightImpact();
        switch(dir) {
          case 'up': _s(Cmd.up);
          case 'down': _s(Cmd.down);
          case 'left': _s(Cmd.left);
          case 'right': _s(Cmd.right);
        }
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        width: 46, height: 46,
        decoration: BoxDecoration(shape: BoxShape.circle,
          color: active ? C.blue.withOpacity(0.2) : Colors.transparent),
        child: Icon(icon,
          color: active ? C.blue : Colors.white.withOpacity(0.4), size: 34),
      ),
    );
  }
}

// ═══════════════════════════════════════
// 📄 صفحة 2: لوحة الأرقام
// ═══════════════════════════════════════
class _NumpadPage extends StatefulWidget {
  final BtService bt;
  const _NumpadPage({required this.bt});
  @override
  State<_NumpadPage> createState() => _NumpadPageState();
}

class _NumpadPageState extends State<_NumpadPage> {
  String _ch = '';
  void _s(int c) => widget.bt.send(c);

  void _press(int n) {
    setState(() { if (_ch.length < 4) _ch += n.toString(); });
    _s(Cmd.n0 + n);
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      child: Center(
        child: Container(
          width: MediaQuery.of(context).size.width * 0.92,
          margin: const EdgeInsets.symmetric(vertical: 16),
          padding: const EdgeInsets.all(20),
          decoration: remoteBox(),
          child: Column(children: [
            // شاشة العرض
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
              decoration: BoxDecoration(
                color: const Color(0xFF0A0A0A),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: C.blue.withOpacity(0.2)),
              ),
              child: Column(children: [
                Text('رقم القناة', style: TextStyle(
                  color: Colors.white.withOpacity(0.4), fontSize: 12)),
                const SizedBox(height: 8),
                Text(_ch.isEmpty ? '---' : _ch,
                  style: TextStyle(
                    color: _ch.isEmpty ? Colors.white.withOpacity(0.2) : C.blue,
                    fontSize: 48, fontWeight: FontWeight.bold,
                    letterSpacing: 12, fontFamily: 'monospace')),
              ]),
            ),
            const SizedBox(height: 20),

            // الأرقام 1-9
            GridView.count(
              crossAxisCount: 3, shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 10, crossAxisSpacing: 10,
              childAspectRatio: 1.4,
              children: List.generate(9, (i) => _numBtn(i + 1)),
            ),
            const SizedBox(height: 10),

            // مسح + 0 + ذهاب
            Row(children: [
              Expanded(child: RBtn(label: 'مسح', icon: Icons.backspace,
                onTap: () => setState(() => _ch = ''),
                h: 60, color: const Color(0xFF2A1A1A),
                glow: C.red.withOpacity(0.5), is_: 20)),
              const SizedBox(width: 10),
              Expanded(child: _numBtn(0, h: 60)),
              const SizedBox(width: 10),
              Expanded(child: RBtn(label: 'ذهاب', icon: Icons.check_circle,
                onTap: () { _s(Cmd.ok); setState(() => _ch = ''); },
                h: 60, color: const Color(0xFF1A2A1A),
                glow: C.green, textColor: C.green, is_: 20)),
            ]),
          ]),
        ),
      ),
    );
  }

  Widget _numBtn(int n, {double h = 56}) {
    return GestureDetector(
      onTap: () { HapticFeedback.lightImpact(); _press(n); },
      child: Container(
        height: h,
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            begin: Alignment.topLeft, end: Alignment.bottomRight,
            colors: [Color(0xFF2E2E2E), Color(0xFF222222)]),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white10),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.6),
            blurRadius: 6, offset: const Offset(0, 3))],
        ),
        child: Center(
          child: Text('$n', style: const TextStyle(
            color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold)),
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════
// 📄 صفحة 3: الأزرار الملونة
// ═══════════════════════════════════════
class _ColorsPage extends StatelessWidget {
  final BtService bt;
  const _ColorsPage({required this.bt});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      child: Center(
        child: Container(
          width: MediaQuery.of(context).size.width * 0.92,
          margin: const EdgeInsets.symmetric(vertical: 16),
          padding: const EdgeInsets.all(24),
          decoration: remoteBox(),
          child: Column(children: [
            Icon(Icons.palette, color: Colors.white.withOpacity(0.5), size: 24),
            const SizedBox(height: 4),
            Text('الأزرار الملونة', style: TextStyle(
              color: Colors.white.withOpacity(0.7), fontSize: 18,
              fontWeight: FontWeight.bold)),
            const SizedBox(height: 24),

            _colorBtn('أحمر', 'إعادة تعيين / وظيفة خاصة 1',
              const Color(0xFFE53935), () => bt.send(Cmd.cRed)),
            const SizedBox(height: 14),
            _colorBtn('أخضر', 'ترتيب / وظيفة خاصة 2',
              const Color(0xFF43A047), () => bt.send(Cmd.cGreen)),
            const SizedBox(height: 14),
            _colorBtn('أصفر', 'معلومات إضافية / وظيفة خاصة 3',
              const Color(0xFFFDD835), () => bt.send(Cmd.cYellow)),
            const SizedBox(height: 14),
            _colorBtn('أزرق', 'تبديل / وظيفة خاصة 4',
              const Color(0xFF1E88E5), () => bt.send(Cmd.cBlue)),

            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.03),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white10)),
              child: Row(children: [
                Icon(Icons.lightbulb_outline,
                  color: C.yellow.withOpacity(0.5), size: 20),
                const SizedBox(width: 12),
                Expanded(child: Text(
                  'وظائف الأزرار تتغير حسب القائمة النشطة',
                  style: TextStyle(color: Colors.white.withOpacity(0.4),
                    fontSize: 12))),
              ]),
            ),
          ]),
        ),
      ),
    );
  }

  Widget _colorBtn(String label, String sub, Color color, VoidCallback onTap) {
    return Builder(builder: (context) {
      return GestureDetector(
        onTap: () { HapticFeedback.mediumImpact(); onTap(); },
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 24),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: color.withOpacity(0.3))),
          child: Row(children: [
            Container(width: 48, height: 48,
              decoration: BoxDecoration(shape: BoxShape.circle, color: color,
                boxShadow: [BoxShadow(color: color.withOpacity(0.5), blurRadius: 8)])),
            const SizedBox(width: 20),
            Expanded(child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: TextStyle(color: color, fontSize: 20,
                  fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(sub, style: TextStyle(color: Colors.white.withOpacity(0.4),
                  fontSize: 12)),
              ],
            )),
            Icon(Icons.arrow_forward_ios, color: color.withOpacity(0.4), size: 18),
          ]),
        ),
      );
    });
  }
}

// ═══════════════════════════════════════
// 📄 صفحة 4: التطبيقات
// ═══════════════════════════════════════
class _AppsPage extends StatelessWidget {
  final BtService bt;
  const _AppsPage({required this.bt});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      child: Center(
        child: Container(
          width: MediaQuery.of(context).size.width * 0.92,
          margin: const EdgeInsets.symmetric(vertical: 16),
          padding: const EdgeInsets.all(24),
          decoration: remoteBox(),
          child: Column(children: [
            Icon(Icons.apps, color: Colors.white.withOpacity(0.5), size: 24),
            const SizedBox(height: 4),
            Text('التطبيقات', style: TextStyle(
              color: Colors.white.withOpacity(0.7), fontSize: 18,
              fontWeight: FontWeight.bold)),
            const SizedBox(height: 24),

            _appBtn('NETFLIX', Icons.play_circle_filled,
              const Color(0xFFE50914), () => bt.send(Cmd.nflix)),
            const SizedBox(height: 14),
            _appBtn('YOUTUBE', Icons.smart_display,
              const Color(0xFFFF0000), () => bt.send(Cmd.ytube)),
            const SizedBox(height: 14),
            _appBtn('SOURCE', Icons.input,
              C.blue, () => bt.send(Cmd.source)),
            const SizedBox(height: 24),

            Text('أزرار سريعة', style: TextStyle(
              color: Colors.white.withOpacity(0.4), fontSize: 14)),
            const SizedBox(height: 14),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                RBtn(label: 'قائمة', icon: Icons.list, w: 80, h: 68,
                  glow: C.orange, onTap: () => bt.send(Cmd.list_)),
                RBtn(label: 'EPG', icon: Icons.calendar_today, w: 80, h: 68,
                  glow: Colors.purple, onTap: () => bt.send(Cmd.epg)),
                RBtn(label: 'صوت', icon: Icons.audiotrack, w: 80, h: 68,
                  glow: C.green, onTap: () => bt.send(Cmd.audio)),
              ],
            ),
          ]),
        ),
      ),
    );
  }

  Widget _appBtn(String label, IconData icon, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: () { HapticFeedback.mediumImpact(); onTap(); },
      child: Container(
        width: double.infinity, height: 76,
        decoration: BoxDecoration(
          gradient: LinearGradient(colors: [color, color.withOpacity(0.7)]),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [BoxShadow(color: color.withOpacity(0.3),
            blurRadius: 12, offset: const Offset(0, 4))]),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: Colors.white, size: 30),
            const SizedBox(width: 14),
            Text(label, style: const TextStyle(color: Colors.white,
              fontSize: 22, fontWeight: FontWeight.bold, letterSpacing: 2)),
          ],
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════
// 📄 صفحة 5: أزرار إضافية
// ═══════════════════════════════════════
class _ExtraPage extends StatelessWidget {
  final BtService bt;
  const _ExtraPage({required this.bt});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      child: Center(
        child: Container(
          width: MediaQuery.of(context).size.width * 0.92,
          margin: const EdgeInsets.symmetric(vertical: 16),
          padding: const EdgeInsets.all(24),
          decoration: remoteBox(),
          child: Column(children: [
            Icon(Icons.settings, color: Colors.white.withOpacity(0.5), size: 24),
            const SizedBox(height: 4),
            Text('أدوات إضافية', style: TextStyle(
              color: Colors.white.withOpacity(0.7), fontSize: 18,
              fontWeight: FontWeight.bold)),
            const SizedBox(height: 20),

            // التحكم الأساسي
            _section('التحكم الأساسي', [
              ('القائمة', Icons.menu, Cmd.menu, Colors.white70),
              ('معلومات', Icons.info_outline, Cmd.info, C.blue),
              ('خروج', Icons.close, Cmd.exit_, C.orange),
            ]),
            const SizedBox(height: 16),

            // المحتوى
            _section('المحتوى', [
              ('القائمة', Icons.format_list_bulleted, Cmd.list_, Colors.tealAccent),
              ('EPG', Icons.calendar_month, Cmd.epg, Colors.purpleAccent),
              ('نص', Icons.text_fields, Cmd.text_, Colors.amberAccent),
            ]),
            const SizedBox(height: 16),

            // الوسائط
            _section('الوسائط', [
              ('تسجيل', Icons.fiber_manual_record, Cmd.rec, C.red),
              ('صوت', Icons.audiotrack, Cmd.audio, C.green),
              ('المصدر', Icons.input, Cmd.source, C.blue),
            ]),
            const SizedBox(height: 20),

            // زر التسجيل الكبير
            RBtn(label: '⏺ تسجيل', icon: Icons.fiber_manual_record,
              onTap: () => bt.send(Cmd.rec),
              w: double.infinity, h: 56,
              color: const Color(0xFF3D1111),
              glow: C.red, textColor: C.red, fs: 16, is_: 20),
          ]),
        ),
      ),
    );
  }

  Widget _section(String title, List<(String, IconData, int, Color)> btns) {
    return Column(children: [
      Align(alignment: Alignment.centerRight,
        child: Text(title, style: TextStyle(
          color: Colors.white.withOpacity(0.4), fontSize: 13,
          fontWeight: FontWeight.w600))),
      const SizedBox(height: 10),
      Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: btns.map((b) => Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4),
            child: RBtn(label: b.$1, icon: b.$2,
              onTap: () => bt.send(b.$3),
              w: double.infinity, h: 68,
              glow: b.$4, textColor: b.$4, is_: 22, fs: 11),
          ),
        )).toList(),
      ),
    ]);
  }
}

// ═══════════════════════════════════════
// 📄 صفحة 6: الماوس اللمسي
// ═══════════════════════════════════════
class _MousePage extends StatefulWidget {
  final BtService bt;
  const _MousePage({required this.bt});
  @override
  State<_MousePage> createState() => _MousePageState();
}

class _MousePageState extends State<_MousePage> {
  bool _t = false;
  Offset _tp = Offset.zero;
  double _sens = 1.5;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      child: Center(
        child: Container(
          width: MediaQuery.of(context).size.width * 0.92,
          margin: const EdgeInsets.symmetric(vertical: 16),
          padding: const EdgeInsets.all(20),
          decoration: remoteBox(),
          child: Column(children: [
            // الرأس + الحساسية
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(children: [
                  Icon(Icons.mouse, color: Colors.white.withOpacity(0.5), size: 22),
                  const SizedBox(width: 8),
                  Text('ماوس لمسي', style: TextStyle(
                    color: Colors.white.withOpacity(0.7), fontSize: 16,
                    fontWeight: FontWeight.bold)),
                ]),
                Row(children: [
                  Text('الحساسية', style: TextStyle(
                    color: Colors.white.withOpacity(0.4), fontSize: 11)),
                  SizedBox(width: 100,
                    child: SliderTheme(
                      data: SliderThemeData(
                        activeTrackColor: C.orange,
                        inactiveTrackColor: C.surfaceL,
                        thumbColor: C.orange, trackHeight: 3,
                        thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6)),
                      child: Slider(value: _sens, min: 0.5, max: 3.0,
                        onChanged: (v) => setState(() => _sens = v)),
                    ),
                  ),
                ]),
              ],
            ),
            const SizedBox(height: 12),

            // منطقة اللمس + سكرول
            Row(children: [
              Expanded(
                child: GestureDetector(
                  onPanStart: (d) => setState(() { _t = true; _tp = d.localPosition; }),
                  onPanUpdate: (d) {
                    setState(() => _tp = d.localPosition);
                    widget.bt.sendMouse(
                      (d.delta.dx * _sens).round(),
                      (d.delta.dy * _sens).round());
                  },
                  onPanEnd: (_) => setState(() => _t = false),
                  onTap: () { HapticFeedback.lightImpact(); widget.bt.send(Cmd.mLeft); },
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    height: 280,
                    decoration: BoxDecoration(
                      color: _t ? C.surfaceL : C.surface,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(
                        color: _t ? C.orange.withOpacity(0.4) : Colors.white10)),
                    child: Stack(children: [
                      CustomPaint(size: Size.infinite, painter: _GridP()),
                      if (_t) Positioned(
                        left: _tp.dx - 20, top: _tp.dy - 20,
                        child: Container(width: 40, height: 40,
                          decoration: BoxDecoration(shape: BoxShape.circle,
                            color: C.orange.withOpacity(0.2),
                            border: Border.all(color: C.orange.withOpacity(0.5), width: 2))),
                      ),
                      if (!_t) Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.touch_app,
                              color: Colors.white.withOpacity(0.1), size: 40),
                            const SizedBox(height: 8),
                            Text('حرّك إصبعك هنا',
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.15), fontSize: 14)),
                          ],
                        ),
                      ),
                    ]),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              ScrollWheel(w: 48, h: 280,
                onScroll: (d) => widget.bt.sendScroll(d * 3)),
            ]),
            const SizedBox(height: 14),

            // أزرار الماوس
            Row(children: [
              Expanded(child: RBtn(label: 'نقر يسار', icon: Icons.mouse,
                onTap: () => widget.bt.send(Cmd.mLeft),
                h: 56, glow: C.blue)),
              const SizedBox(width: 12),
              Expanded(child: RBtn(label: 'نقر يمين', icon: Icons.ads_click,
                onTap: () => widget.bt.send(Cmd.mRight),
                h: 56, glow: C.green)),
            ]),
            const SizedBox(height: 12),

            // زر الكيبورد
            RBtn(label: 'فتح الكيبورد', icon: Icons.keyboard,
              w: double.infinity, h: 48, glow: Colors.purpleAccent, fs: 14,
              onTap: () => _showKB(context)),
          ]),
        ),
      ),
    );
  }

  void _showKB(BuildContext ctx) {
    showModalBottomSheet(
      context: ctx,
      backgroundColor: const Color(0xFF1A1A1A),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      isScrollControlled: true,
      builder: (_) => _KBSheet(bt: widget.bt),
    );
  }
}

class _GridP extends CustomPainter {
  @override
  void paint(Canvas c, Size s) {
    final p = Paint()..color = Colors.white.withOpacity(0.03)..strokeWidth = 0.5;
    for (double x = 0; x < s.width; x += 30)
      c.drawLine(Offset(x, 0), Offset(x, s.height), p);
    for (double y = 0; y < s.height; y += 30)
      c.drawLine(Offset(0, y), Offset(s.width, y), p);
  }
  @override
  bool shouldRepaint(covariant CustomPainter o) => false;
}

// ═══════════════════════════════════════
// ⌨️ الكيبورد
// ═══════════════════════════════════════
class _KBSheet extends StatefulWidget {
  final BtService bt;
  const _KBSheet({required this.bt});
  @override
  State<_KBSheet> createState() => _KBSheetState();
}

class _KBSheetState extends State<_KBSheet> {
  bool _ar = false;
  bool _up = false;
  String _txt = '';

  final _en = [
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['z','x','c','v','b','n','m'],
  ];
  final _arK = [
    ['ض','ص','ث','ق','ف','غ','ع','ه','خ','ح','ج'],
    ['ش','س','ي','ب','ل','ا','ت','ن','م','ك'],
    ['ئ','ء','ؤ','ر','لا','ى','ة','و','ز','ظ'],
  ];

  void _type(String ch) {
    setState(() => _txt += ch);
    widget.bt.send(ch.codeUnitAt(0));
  }

  @override
  Widget build(BuildContext context) {
    final keys = _ar ? _arK : _en;
    return Padding(
      padding: const EdgeInsets.all(12),
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        Container(width: 40, height: 4, margin: const EdgeInsets.only(bottom: 12),
          decoration: BoxDecoration(color: Colors.white24,
            borderRadius: BorderRadius.circular(2))),

        // حقل النص
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(12),
          margin: const EdgeInsets.only(bottom: 12),
          decoration: BoxDecoration(
            color: Colors.black38,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.white10)),
          child: Text(_txt.isEmpty ? 'اكتب هنا...' : _txt,
            style: TextStyle(
              color: _txt.isEmpty ? Colors.white24 : Colors.white,
              fontSize: 16),
            textDirection: _ar ? TextDirection.rtl : TextDirection.ltr),
        ),

        // صفوف المفاتيح
        for (final row in keys)
          Padding(
            padding: const EdgeInsets.only(bottom: 5),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: row.map((k) {
                String dk = _up && !_ar ? k.toUpperCase() : k;
                return Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 2),
                    child: GestureDetector(
                      onTap: () { HapticFeedback.lightImpact(); _type(dk); },
                      child: Container(
                        height: 42,
                        decoration: BoxDecoration(
                          color: const Color(0xFF2A2A2A),
                          borderRadius: BorderRadius.circular(8)),
                        child: Center(child: Text(dk,
                          style: const TextStyle(color: Colors.white, fontSize: 16))),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
        const SizedBox(height: 4),

        // الصف السفلي
        Row(children: [
          _sKey(icon: Icons.arrow_upward, active: _up,
            onTap: () => setState(() => _up = !_up)),
          const SizedBox(width: 5),
          _sKey(label: _ar ? 'EN' : 'عر',
            onTap: () => setState(() => _ar = !_ar)),
          const SizedBox(width: 5),
          Expanded(child: GestureDetector(
            onTap: () { _type(' '); },
            child: Container(height: 44,
              decoration: BoxDecoration(color: const Color(0xFF2A2A2A),
                borderRadius: BorderRadius.circular(8)),
              child: const Center(child: Text('مسافة',
                style: TextStyle(color: Colors.white70, fontSize: 14)))),
          )),
          const SizedBox(width: 5),
          _sKey(icon: Icons.backspace,
            onTap: () { if (_txt.isNotEmpty) setState(() => _txt = _txt.substring(0, _txt.length-1)); }),
          const SizedBox(width: 5),
          _sKey(icon: Icons.send, active: true, color: C.blue,
            onTap: () => Navigator.pop(context)),
        ]),
        SizedBox(height: MediaQuery.of(context).viewInsets.bottom + 12),
      ]),
    );
  }

  Widget _sKey({IconData? icon, String? label, bool active = false,
      Color color = Colors.white, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: () { HapticFeedback.lightImpact(); onTap(); },
      child: Container(
        width: 48, height: 44,
        decoration: BoxDecoration(
          color: active ? color.withOpacity(0.2) : const Color(0xFF2A2A2A),
          borderRadius: BorderRadius.circular(8),
          border: active ? Border.all(color: color.withOpacity(0.4)) : null),
        child: Center(
          child: icon != null
              ? Icon(icon, color: active ? color : Colors.white70, size: 20)
              : Text(label!, style: const TextStyle(
                  color: Colors.white70, fontSize: 14, fontWeight: FontWeight.bold)),
        ),
      ),
    );
  }
}
