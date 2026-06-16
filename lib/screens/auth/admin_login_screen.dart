import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../utils/app_routes.dart';

class AdminLoginScreen extends StatefulWidget {
  const AdminLoginScreen({Key? key}) : super(key: key);

  @override
  State<AdminLoginScreen> createState() => _AdminLoginScreenState();
}

class _AdminLoginScreenState extends State<AdminLoginScreen> {
  final _formKey = GlobalKey<FormState>();

  final _adminIdController = TextEditingController();

  final _passwordController = TextEditingController();

  void _login() {
    if (_formKey.currentState!.validate()) {
      if (_adminIdController.text.trim() != 'admin' ||
          _passwordController.text.trim() != '1234') {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            backgroundColor: Colors.red,
            content: Text(
              'Invalid Admin Credentials',
            ),
          ),
        );

        return;
      }

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: Colors.green,
          content: Text(
            'Admin Login Successful',
          ),
        ),
      );

      Navigator.pushReplacementNamed(
        context,
        AppRoutes.adminDashboard,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: ConstrainedBox(
            constraints: const BoxConstraints(
              maxWidth: 400,
            ),
            child: Container(
              padding: const EdgeInsets.all(32.0),
              decoration: BoxDecoration(
                color: AppTheme.surfaceColor,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color:
                  AppTheme.secondaryColor.withOpacity(0.5),
                  width: 1,
                ),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.secondaryColor
                        .withOpacity(0.2),
                    blurRadius: 20,
                    spreadRadius: 2,
                  ),
                ],
              ),
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.admin_panel_settings,
                      size: 64,
                      color: AppTheme.secondaryColor,
                    ),

                    const SizedBox(height: 16),

                    const Text(
                      'ParkPilot',
                      style: TextStyle(
                        fontSize: 32,
                        fontWeight:
                        FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),

                    const Text(
                      'Admin Portal',
                      style: TextStyle(
                        color:
                        AppTheme.secondaryColor,
                        fontSize: 16,
                      ),
                    ),

                    const SizedBox(height: 40),

                    TextFormField(
                      controller: _adminIdController,
                      decoration:
                      const InputDecoration(
                        labelText: 'Admin ID',
                        prefixIcon: Icon(
                          Icons.badge_outlined,
                        ),
                      ),
                      validator: (value) =>
                      value!.isEmpty
                          ? 'Enter Admin ID'
                          : null,
                    ),

                    const SizedBox(height: 20),

                    TextFormField(
                      controller: _passwordController,
                      obscureText: true,
                      decoration:
                      const InputDecoration(
                        labelText: 'Password',
                        prefixIcon: Icon(
                          Icons.lock_outline,
                        ),
                      ),
                      validator: (value) =>
                      value!.isEmpty
                          ? 'Enter password'
                          : null,
                    ),

                    const SizedBox(height: 30),

                    Container(
                      width: double.infinity,
                      height: 50,
                      decoration: BoxDecoration(
                        borderRadius:
                        BorderRadius.circular(12),
                        gradient:
                        const LinearGradient(
                          colors: [
                            AppTheme.secondaryColor,
                            AppTheme.primaryColor,
                          ],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme
                                .secondaryColor
                                .withOpacity(0.4),
                            blurRadius: 12,
                            offset:
                            const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: ElevatedButton(
                        onPressed: _login,
                        style:
                        ElevatedButton.styleFrom(
                          backgroundColor:
                          Colors.transparent,
                          shadowColor:
                          Colors.transparent,
                        ),
                        child: const Text(
                          'ADMIN LOGIN',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight:
                            FontWeight.bold,
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),

                    TextButton(
                      onPressed: () {
                        Navigator.pushReplacementNamed(
                          context,
                          AppRoutes.studentLogin,
                        );
                      },
                      child: const Text(
                        'Are you a Student? Login here',
                        style: TextStyle(
                          color: Colors.white70,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _adminIdController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}