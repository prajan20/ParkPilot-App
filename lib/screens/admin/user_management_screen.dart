import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../services/parking_service.dart';

class UserManagementScreen extends StatelessWidget {
  const UserManagementScreen({super.key});

  @override
  Widget build(BuildContext context) {

    final parkingService =
    Provider.of<ParkingService>(context);

    // ONLY REAL USERS
    final users = parkingService.history;

    return Scaffold(

      backgroundColor: const Color(0xFF050B18),

      appBar: AppBar(
        backgroundColor: const Color(0xFF0F2A35),

        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back,
            color: Colors.cyanAccent,
          ),

          onPressed: () {
            Navigator.pop(context);
          },
        ),

        title: const Text(
          'User Management',

          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),

        centerTitle: true,
      ),

      body: users.isEmpty

          ? const Center(
        child: Text(
          'No Registered Users',
          style: TextStyle(
            color: Colors.white54,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
      )

          : Padding(
        padding: const EdgeInsets.all(20),

        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,

          children: [

            const Text(
              'Registered Users',

              style: TextStyle(
                color: Colors.white,
                fontSize: 32,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 20),

            Expanded(
              child: ListView.builder(

                itemCount: users.length,

                itemBuilder: (context, index) {

                  final user = users[index];

                  final isActive =
                      user['status'] == 'Active';

                  return Container(

                    margin: const EdgeInsets.only(bottom: 18),

                    padding: const EdgeInsets.all(20),

                    decoration: BoxDecoration(

                      color: const Color(0xFF111827),

                      borderRadius: BorderRadius.circular(22),

                      border: Border.all(
                        color: isActive
                            ? Colors.greenAccent
                            : Colors.redAccent,
                      ),

                      boxShadow: [
                        BoxShadow(
                          color: isActive
                              ? Colors.greenAccent.withOpacity(0.08)
                              : Colors.redAccent.withOpacity(0.08),

                          blurRadius: 10,
                          spreadRadius: 1,
                        ),
                      ],
                    ),

                    child: Row(
                      children: [

                        Container(

                          width: 65,
                          height: 65,

                          decoration: BoxDecoration(
                            shape: BoxShape.circle,

                            color: isActive
                                ? Colors.green.withOpacity(0.15)
                                : Colors.red.withOpacity(0.15),
                          ),

                          child: Icon(
                            isActive
                                ? Icons.person
                                : Icons.person_off,

                            color: isActive
                                ? Colors.greenAccent
                                : Colors.redAccent,

                            size: 34,
                          ),
                        ),

                        const SizedBox(width: 18),

                        Expanded(
                          child: Column(

                            crossAxisAlignment:
                            CrossAxisAlignment.start,

                            children: [

                              Text(
                                user['student']
                                    .toString(),

                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),

                              const SizedBox(height: 8),

                              Text(
                                'Vehicle: ${user['vehicle']}',

                                style: const TextStyle(
                                  color: Colors.white70,
                                  fontSize: 15,
                                ),
                              ),

                              const SizedBox(height: 5),

                              Text(
                                'Booked Slot: ${user['slot']}',

                                style: const TextStyle(
                                  color: Colors.cyanAccent,
                                  fontSize: 15,
                                ),
                              ),
                            ],
                          ),
                        ),

                        Column(
                          children: [

                            Container(

                              padding: const EdgeInsets.symmetric(
                                horizontal: 14,
                                vertical: 8,
                              ),

                              decoration: BoxDecoration(

                                color: isActive
                                    ? Colors.green.withOpacity(0.15)
                                    : Colors.red.withOpacity(0.15),

                                borderRadius:
                                BorderRadius.circular(30),
                              ),

                              child: Text(
                                user['status'].toString(),

                                style: TextStyle(
                                  color: isActive
                                      ? Colors.greenAccent
                                      : Colors.redAccent,

                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),

                            const SizedBox(height: 14),

                            IconButton(

                              onPressed: () {

                                parkingService
                                    .cancelBookingByAdmin(
                                  user['student'],
                                );

                                ScaffoldMessenger.of(context)
                                    .showSnackBar(

                                  SnackBar(

                                    backgroundColor:
                                    Colors.redAccent,

                                    content: Text(
                                      '${user['student']} booking cancelled',
                                    ),
                                  ),
                                );
                              },

                              icon: const Icon(
                                Icons.delete,

                                color: Colors.redAccent,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}