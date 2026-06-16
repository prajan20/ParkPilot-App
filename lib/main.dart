import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'firebase_options.dart';
import 'theme/app_theme.dart';
import 'utils/app_routes.dart';
import 'services/parking_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  runApp(const ParkPilotApp());
}

class ParkPilotApp extends StatelessWidget {
  const ParkPilotApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => ParkingService(),
      child: MaterialApp(
        title: 'ParkPilot',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.darkTheme,
        initialRoute: '/',
        routes: {
          '/': (context) => const SplashScreen(),
          ...AppRoutes.getRoutes(),
        },
      ),
    );
  }
}

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();

    Future.delayed(
      const Duration(seconds: 3),
          () {
        if (mounted) {
          Navigator.pushReplacementNamed(
            context,
            AppRoutes.initial,
          );
        }
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF050B18),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 130,
              height: 130,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: [
                    Colors.cyanAccent.withOpacity(0.8),
                    Colors.blueAccent,
                  ],
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.cyanAccent.withOpacity(0.4),
                    blurRadius: 30,
                    spreadRadius: 5,
                  ),
                ],
              ),
              child: const Icon(
                Icons.local_parking,
                size: 70,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 35),
            const Text(
              'ParkPilot',
              style: TextStyle(
                color: Colors.white,
                fontSize: 42,
                fontWeight: FontWeight.bold,
                letterSpacing: 2,
              ),
            ),
            const SizedBox(height: 10),
            const Text(
              'Smart Parking Management',
              style: TextStyle(
                color: Colors.white70,
                fontSize: 18,
                letterSpacing: 1,
              ),
            ),
            const SizedBox(height: 45),
            const CircularProgressIndicator(
              color: Colors.cyanAccent,
            ),
          ],
        ),
      ),
    );
  }
}