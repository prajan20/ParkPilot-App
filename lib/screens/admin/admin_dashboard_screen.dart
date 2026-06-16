import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../theme/app_theme.dart';
import '../../utils/app_routes.dart';
import '../../services/parking_service.dart';

import 'manage_slots_screen.dart';
import 'parking_analytics_screen.dart';
import 'user_management_screen.dart';
import 'activity_logs_screen.dart';

class AdminDashboardScreen extends StatelessWidget {
  const AdminDashboardScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {

    final parkingService =
    Provider.of<ParkingService>(context);

    final slots = parkingService.slots;

    final totalSlots = slots.length;

    // UPDATED OCCUPIED LOGIC
    final occupiedSlots = slots.where((slot) {

      final timings = slot['timings'] as List;

      return timings.any(
            (timing) => timing['isBooked'] == true,
      );

    }).length;

    final freeSlots =
        totalSlots - occupiedSlots;

    return Scaffold(

      appBar: AppBar(

        title: const Text('Admin Dashboard'),

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
                AppRoutes.adminLogin,
              );
            },
          )
        ],
      ),

      body: SingleChildScrollView(

        padding: const EdgeInsets.all(24.0),

        child: Column(

          crossAxisAlignment:
          CrossAxisAlignment.start,

          children: [

            const Text(

              'System Overview',

              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),

            const SizedBox(height: 24),

            // STATISTICS GRID
            LayoutBuilder(

              builder: (context, constraints) {

                int crossAxisCount =
                constraints.maxWidth > 800
                    ? 3
                    : (constraints.maxWidth > 500
                    ? 2
                    : 1);

                return GridView.count(

                  crossAxisCount: crossAxisCount,

                  crossAxisSpacing: 16,

                  mainAxisSpacing: 16,

                  shrinkWrap: true,

                  physics:
                  const NeverScrollableScrollPhysics(),

                  childAspectRatio:
                  constraints.maxWidth > 800
                      ? 1.5
                      : 2.0,

                  children: [

                    _buildStatCard(
                      'Total Slots',
                      '$totalSlots',
                      Icons.local_parking,
                      AppTheme.secondaryColor,
                    ),

                    _buildStatCard(
                      'Occupied Slots',
                      '$occupiedSlots',
                      Icons.directions_car,
                      AppTheme.errorColor,
                    ),

                    _buildStatCard(
                      'Free Slots',
                      '$freeSlots',
                      Icons.check_circle_outline,
                      AppTheme.successColor,
                    ),
                  ],
                );
              },
            ),

            const SizedBox(height: 32),

            const Text(

              'Admin Actions',

              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),

            const SizedBox(height: 16),

            Wrap(

              spacing: 16,

              runSpacing: 16,

              children: [

                // MANAGE SLOTS
                _buildActionCard(

                  context,

                  title: 'Manage Slots',

                  icon: Icons.edit_location_alt,

                  color: AppTheme.primaryColor,

                  onTap: () {

                    Navigator.push(

                      context,

                      MaterialPageRoute(

                        builder: (_) =>
                        const ManageSlotsScreen(),
                      ),
                    );
                  },
                ),

                // ANALYTICS
                _buildActionCard(

                  context,

                  title: 'Parking Analytics',

                  icon: Icons.analytics,

                  color: Colors.purpleAccent,

                  onTap: () {

                    Navigator.push(

                      context,

                      MaterialPageRoute(

                        builder: (_) =>
                        const ParkingAnalyticsScreen(),
                      ),
                    );
                  },
                ),

                // USERS
                _buildActionCard(

                  context,

                  title: 'User Management',

                  icon: Icons.people_alt,

                  color: Colors.orangeAccent,

                  onTap: () {

                    Navigator.push(

                      context,

                      MaterialPageRoute(

                        builder: (_) =>
                        const UserManagementScreen(),
                      ),
                    );
                  },
                ),

                // LOGS
                _buildActionCard(

                  context,

                  title: 'Activity Logs',

                  icon: Icons.receipt_long,

                  color: AppTheme.successColor,

                  onTap: () {

                    Navigator.push(

                      context,

                      MaterialPageRoute(

                        builder: (_) =>
                        const ActivityLogsScreen(),
                      ),
                    );
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // STAT CARD
  Widget _buildStatCard(

      String title,
      String value,
      IconData icon,
      Color color,
      ) {

    return Container(

      padding: const EdgeInsets.all(20),

      decoration: BoxDecoration(

        color: AppTheme.surfaceColor,

        borderRadius: BorderRadius.circular(16),

        border: Border.all(
          color: color.withOpacity(0.3),
        ),

        boxShadow: [

          BoxShadow(
            color: color.withOpacity(0.1),
            blurRadius: 10,
            spreadRadius: 1,
          )
        ],
      ),

      child: Column(

        mainAxisAlignment:
        MainAxisAlignment.center,

        children: [

          Icon(
            icon,
            size: 40,
            color: color,
          ),

          const SizedBox(height: 12),

          Text(

            value,

            style: TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),

          const SizedBox(height: 4),

          Text(

            title,

            style: const TextStyle(
              color: AppTheme.textSecondaryColor,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }

  // ACTION CARD
  Widget _buildActionCard(

      BuildContext context, {

        required String title,

        required IconData icon,

        required Color color,

        required VoidCallback onTap,
      }) {

    return InkWell(

      onTap: onTap,

      borderRadius: BorderRadius.circular(16),

      child: Container(

        width: 160,

        height: 120,

        padding: const EdgeInsets.all(16),

        decoration: BoxDecoration(

          color: AppTheme.surfaceColor,

          borderRadius: BorderRadius.circular(16),

          border: Border.all(
            color: color.withOpacity(0.3),
          ),

          boxShadow: [

            BoxShadow(
              color: color.withOpacity(0.05),
              blurRadius: 10,
              spreadRadius: 1,
            )
          ],
        ),

        child: Column(

          mainAxisAlignment:
          MainAxisAlignment.center,

          children: [

            Icon(
              icon,
              size: 32,
              color: color,
            ),

            const SizedBox(height: 12),

            Text(

              title,

              textAlign: TextAlign.center,

              style: const TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}