import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../theme/app_theme.dart';
import '../../utils/app_routes.dart';
import '../../services/parking_service.dart';

class StudentLoginScreen extends StatefulWidget {
  const StudentLoginScreen({Key? key}) : super(key: key);

  @override
  State<StudentLoginScreen> createState() =>
      _StudentLoginScreenState();
}

class _StudentLoginScreenState
    extends State<StudentLoginScreen> {

  final _formKey = GlobalKey<FormState>();

  final _nameController =
  TextEditingController();

  final _emailController =
  TextEditingController();

  final _passwordController =
  TextEditingController();

  void _login() {

    if (_formKey.currentState!.validate()) {

      // Fixed student password
      if (_passwordController.text != "1234") {

        ScaffoldMessenger.of(context).showSnackBar(

          const SnackBar(
            backgroundColor: Colors.red,
            content: Text(
              "Wrong Password",
            ),
          ),
        );

        return;
      }

      Provider.of<ParkingService>(
        context,
        listen: false,
      ).loginStudent(
        _nameController.text,
        _emailController.text,
      );

      ScaffoldMessenger.of(context)
          .showSnackBar(

        SnackBar(

          backgroundColor:
          Colors.green,

          content: Text(
            'Welcome ${_nameController.text}',
          ),
        ),
      );

      Navigator.pushReplacementNamed(
        context,
        AppRoutes.studentDashboard,
      );
    }
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      body: Center(

        child: SingleChildScrollView(

          padding:
          const EdgeInsets.all(24.0),

          child: ConstrainedBox(

            constraints:
            const BoxConstraints(
              maxWidth: 400,
            ),

            child: Container(

              padding:
              const EdgeInsets.all(32.0),

              decoration: BoxDecoration(

                color:
                AppTheme.surfaceColor,

                borderRadius:
                BorderRadius.circular(20),

                border: Border.all(
                  color: AppTheme.primaryColor
                      .withOpacity(0.5),
                  width: 1,
                ),

                boxShadow: [

                  BoxShadow(
                    color: AppTheme.primaryColor
                        .withOpacity(0.2),

                    blurRadius: 20,
                    spreadRadius: 2,
                  ),
                ],
              ),

              child: Form(

                key: _formKey,

                child: Column(

                  mainAxisSize:
                  MainAxisSize.min,

                  children: [

                    const Icon(
                      Icons.directions_car,
                      size: 64,
                      color:
                      AppTheme.primaryColor,
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

                      'Student Portal',

                      style: TextStyle(
                        color:
                        AppTheme.primaryColor,
                        fontSize: 16,
                      ),
                    ),

                    const SizedBox(height: 40),

                    TextFormField(

                      controller:
                      _nameController,

                      decoration:
                      const InputDecoration(
                        labelText:
                        'Student Name',

                        prefixIcon:
                        Icon(Icons.person),
                      ),

                      validator: (value) =>
                      value!.isEmpty
                          ? 'Enter Name'
                          : null,
                    ),

                    const SizedBox(height: 20),

                    TextFormField(

                      controller:
                      _emailController,

                      decoration:
                      const InputDecoration(
                        labelText:
                        'University Email',

                        prefixIcon:
                        Icon(Icons.email_outlined),
                      ),

                      validator: (value) {

                        if (value == null ||
                            value.isEmpty) {
                          return 'Enter Email';
                        }

                        if (!value.contains('@')) {
                          return 'Enter Valid Email';
                        }

                        return null;
                      },
                    ),

                    const SizedBox(height: 20),

                    TextFormField(

                      controller:
                      _passwordController,

                      obscureText: true,

                      decoration:
                      const InputDecoration(
                        labelText:
                        'Password',

                        prefixIcon:
                        Icon(Icons.lock_outline),
                      ),

                      validator: (value) =>
                      value!.isEmpty
                          ? 'Enter Password'
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
                            AppTheme.primaryColor,
                            AppTheme.secondaryColor,
                          ],
                        ),

                        boxShadow: [

                          BoxShadow(
                            color: AppTheme.primaryColor
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

                          'LOGIN',

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

                        Navigator
                            .pushReplacementNamed(
                          context,
                          AppRoutes.adminLogin,
                        );
                      },

                      child: const Text(

                        'Are you an Admin? Login here',

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

    _nameController.dispose();

    _emailController.dispose();

    _passwordController.dispose();

    super.dispose();
  }
}