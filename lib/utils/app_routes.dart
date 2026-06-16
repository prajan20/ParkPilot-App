import 'package:flutter/material.dart';
import '../screens/auth/student_login_screen.dart';
import '../screens/auth/admin_login_screen.dart';
import '../screens/student/student_layout.dart';
import '../screens/admin/admin_dashboard_screen.dart';

class AppRoutes {
  static const String initial = '/student-login';

  static const String studentLogin = '/student-login';
  static const String adminLogin = '/admin-login';

  static const String studentDashboard = '/student-dashboard';
  static const String adminDashboard = '/admin-dashboard';

  static Map<String, WidgetBuilder> getRoutes() {
    return {
      studentLogin: (context) => const StudentLoginScreen(),
      adminLogin: (context) => const AdminLoginScreen(),
      studentDashboard: (context) => const StudentLayout(),
      adminDashboard: (context) => const AdminDashboardScreen(),
    };
  }
}