import 'dart:async';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../theme/app_theme.dart';
import '../../utils/app_routes.dart';
import '../../services/parking_service.dart';

class StudentDashboardScreen extends StatefulWidget {
  const StudentDashboardScreen({Key? key}) : super(key: key);

  @override
  State<StudentDashboardScreen> createState() =>
      _StudentDashboardScreenState();
}

class _StudentDashboardScreenState
    extends State<StudentDashboardScreen> {

  late Timer _timer;

  String currentTime = '';

  @override
  void initState() {
    super.initState();

    _updateTime();

    _timer = Timer.periodic(
      const Duration(seconds: 1),
          (_) => _updateTime(),
    );
  }

  void _updateTime() {

    final now = DateTime.now();

    setState(() {

      currentTime =
      '${now.hour.toString().padLeft(2, '0')} : '
          '${now.minute.toString().padLeft(2, '0')} : '
          '${now.second.toString().padLeft(2, '0')}';
    });
  }

  @override
  void dispose() {

    _timer.cancel();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {

    final parkingService =
    Provider.of<ParkingService>(context);

    final studentName =
        parkingService.studentName ?? 'Student';

    final bookedSlot =
        parkingService.bookedSlot;

    final vehicleNumber =
        parkingService.vehicleNumber;

    final totalSlots =
        parkingService.totalSlots;

    final occupiedSlots =
        parkingService.occupiedSlots;

    final freeSlots =
        parkingService.freeSlots;

    return Scaffold(

      appBar: AppBar(

        title: const Text('Dashboard'),

        actions: [

          IconButton(

            icon: const Icon(
              Icons.logout,
              color: AppTheme.errorColor,
            ),

            tooltip: 'Logout',

            onPressed: () {

              Navigator.pushReplacementNamed(
                context,
                AppRoutes.studentLogin,
              );
            },
          )
        ],
      ),

      body: SingleChildScrollView(

        padding: const EdgeInsets.all(20),

        child: Column(

          crossAxisAlignment:
          CrossAxisAlignment.start,

          children: [

            // WELCOME
            Text(

              'Welcome back, $studentName!',

              style: const TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),

            const SizedBox(height: 8),

            const Text(

              'Smart Parking Dashboard',

              style: TextStyle(
                color: Colors.white54,
                fontSize: 15,
              ),
            ),

            const SizedBox(height: 24),

            // LIVE CLOCK
            Container(

              width: double.infinity,

              padding: const EdgeInsets.all(20),

              decoration: BoxDecoration(

                color: AppTheme.surfaceColor,

                borderRadius:
                BorderRadius.circular(18),

                border: Border.all(
                  color: AppTheme.primaryColor
                      .withOpacity(0.3),
                ),
              ),

              child: Column(

                children: [

                  const Icon(
                    Icons.access_time,
                    color: AppTheme.primaryColor,
                    size: 40,
                  ),

                  const SizedBox(height: 12),

                  const Text(

                    'Current Time',

                    style: TextStyle(
                      color: Colors.white54,
                      fontSize: 16,
                    ),
                  ),

                  const SizedBox(height: 8),

                  Text(

                    currentTime,

                    style: const TextStyle(
                      color: AppTheme.primaryColor,
                      fontSize: 34,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 2,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // ACTIVE BOOKING
            _buildInfoCard(

              title: 'Active Booking',

              value: bookedSlot != null
                  ? 'Slot $bookedSlot'
                  : 'No Active Booking',

              subtitle: bookedSlot != null
                  ? 'Vehicle: $vehicleNumber'
                  : 'Ready to park?',

              icon: Icons.local_parking,

              color: AppTheme.primaryColor,
            ),

            const SizedBox(height: 18),

            // GRID STATS
            Row(

              children: [

                Expanded(
                  child: _buildMiniCard(

                    title: 'Total Slots',

                    value: totalSlots.toString(),

                    icon: Icons.grid_view,

                    color: Colors.blue,
                  ),
                ),

                const SizedBox(width: 14),

                Expanded(
                  child: _buildMiniCard(

                    title: 'Occupied',

                    value: occupiedSlots.toString(),

                    icon: Icons.car_rental,

                    color: Colors.redAccent,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 14),

            Row(

              children: [

                Expanded(
                  child: _buildMiniCard(

                    title: 'Free Slots',

                    value: freeSlots.toString(),

                    icon: Icons.check_circle,

                    color: Colors.greenAccent,
                  ),
                ),

                const SizedBox(width: 14),

                Expanded(
                  child: _buildMiniCard(

                    title: 'History',

                    value: parkingService.history.length
                        .toString(),

                    icon: Icons.history,

                    color: Colors.orangeAccent,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // BIG CARD
  Widget _buildInfoCard({

    required String title,

    required String value,

    required String subtitle,

    required IconData icon,

    required Color color,
  }) {

    return Container(

      padding: const EdgeInsets.all(20),

      decoration: BoxDecoration(

        color: AppTheme.surfaceColor,

        borderRadius: BorderRadius.circular(18),

        border: Border.all(
          color: color.withOpacity(0.3),
        ),

        boxShadow: [

          BoxShadow(
            color: color.withOpacity(0.1),
            blurRadius: 12,
            spreadRadius: 1,
          )
        ],
      ),

      child: Row(

        children: [

          Container(

            padding: const EdgeInsets.all(14),

            decoration: BoxDecoration(

              color: color.withOpacity(0.1),

              shape: BoxShape.circle,
            ),

            child: Icon(
              icon,
              color: color,
              size: 34,
            ),
          ),

          const SizedBox(width: 20),

          Expanded(

            child: Column(

              crossAxisAlignment:
              CrossAxisAlignment.start,

              children: [

                Text(

                  title,

                  style: const TextStyle(
                    color: AppTheme.textSecondaryColor,
                    fontSize: 14,
                  ),
                ),

                const SizedBox(height: 6),

                Text(

                  value,

                  style: TextStyle(
                    color: color,
                    fontSize: 30,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 6),

                Text(

                  subtitle,

                  style: const TextStyle(
                    color: AppTheme.textSecondaryColor,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }

  // MINI CARD
  Widget _buildMiniCard({

    required String title,

    required String value,

    required IconData icon,

    required Color color,
  }) {

    return Container(

      padding: const EdgeInsets.all(18),

      decoration: BoxDecoration(

        color: AppTheme.surfaceColor,

        borderRadius: BorderRadius.circular(18),

        border: Border.all(
          color: color.withOpacity(0.3),
        ),
      ),

      child: Column(

        children: [

          Icon(
            icon,
            color: color,
            size: 34,
          ),

          const SizedBox(height: 10),

          Text(

            value,

            style: TextStyle(
              color: color,
              fontSize: 30,
              fontWeight: FontWeight.bold,
            ),
          ),

          const SizedBox(height: 6),

          Text(

            title,

            style: const TextStyle(
              color: Colors.white70,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }
}