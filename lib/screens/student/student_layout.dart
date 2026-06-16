import 'package:flutter/material.dart';

import '../../theme/app_theme.dart';
import 'student_dashboard_screen.dart';
import 'slot_booking_screen.dart';
import 'qr_pass_screen.dart';
import 'parking_history_screen.dart';

class StudentLayout extends StatefulWidget {
  const StudentLayout({Key? key}) : super(key: key);

  @override
  State<StudentLayout> createState() => _StudentLayoutState();
}

class _StudentLayoutState extends State<StudentLayout> {
  int _currentIndex = 0;

  final List<Widget> _pages = const [
    StudentDashboardScreen(),
    SlotBookingScreen(),
    QRPassScreen(),
    ParkingHistoryScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,

      body: SafeArea(
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 300),
          child: _pages[_currentIndex],
        ),
      ),

      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: AppTheme.surfaceColor,
          border: Border(
            top: BorderSide(
              color: AppTheme.primaryColor.withOpacity(0.2),
            ),
          ),
          boxShadow: [
            BoxShadow(
              color: AppTheme.primaryColor.withOpacity(0.08),
              blurRadius: 12,
              offset: const Offset(0, -4),
            ),
          ],
        ),

        child: BottomNavigationBar(
          currentIndex: _currentIndex,

          onTap: (index) {
            setState(() {
              _currentIndex = index;
            });
          },

          backgroundColor: AppTheme.surfaceColor,

          selectedItemColor: AppTheme.primaryColor,

          unselectedItemColor: AppTheme.textSecondaryColor,

          type: BottomNavigationBarType.fixed,

          elevation: 0,

          selectedLabelStyle: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 13,
          ),

          unselectedLabelStyle: const TextStyle(
            fontSize: 12,
          ),

          items: const [

            BottomNavigationBarItem(
              icon: Icon(Icons.dashboard_rounded),
              label: 'Home',
            ),

            BottomNavigationBarItem(
              icon: Icon(Icons.local_parking_rounded),
              label: 'Book',
            ),

            BottomNavigationBarItem(
              icon: Icon(Icons.qr_code_2_rounded),
              label: 'Pass',
            ),

            BottomNavigationBarItem(
              icon: Icon(Icons.history_rounded),
              label: 'History',
            ),
          ],
        ),
      ),
    );
  }
}