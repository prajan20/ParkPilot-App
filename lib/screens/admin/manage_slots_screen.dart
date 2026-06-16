import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../services/parking_service.dart';
import '../../theme/app_theme.dart';

class ManageSlotsScreen extends StatelessWidget {
  const ManageSlotsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {

    final parkingService =
    Provider.of<ParkingService>(context);

    final slots = parkingService.slots;

    return Scaffold(

      appBar: AppBar(
        title: const Text('Manage Slots'),
      ),

      body: ListView.builder(

        padding: const EdgeInsets.all(16),

        itemCount: slots.length,

        itemBuilder: (context, index) {

          final slot = slots[index];

          final timings =
          slot['timings'] as List;

          return Container(

            margin:
            const EdgeInsets.only(bottom: 18),

            padding: const EdgeInsets.all(18),

            decoration: BoxDecoration(

              color: AppTheme.surfaceColor,

              borderRadius:
              BorderRadius.circular(20),

              border: Border.all(
                color: AppTheme.primaryColor
                    .withOpacity(0.3),
              ),
            ),

            child: Column(

              crossAxisAlignment:
              CrossAxisAlignment.start,

              children: [

                // SLOT TITLE
                Text(

                  slot['id'],

                  style: const TextStyle(

                    color: AppTheme.primaryColor,

                    fontSize: 26,

                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 18),

                // TIMINGS
                Wrap(

                  spacing: 12,

                  runSpacing: 12,

                  children:
                  timings.map<Widget>((timing) {

                    final isBooked =
                    timing['isBooked'];

                    return GestureDetector(

                      onTap: () {

                        parkingService
                            .toggleSlotStatus(

                          slot['id'],

                          timing['time'],
                        );

                        ScaffoldMessenger.of(
                            context)
                            .showSnackBar(

                          SnackBar(

                            content: Text(

                              '${slot['id']} - ${timing['time']} updated',
                            ),

                            behavior:
                            SnackBarBehavior
                                .floating,
                          ),
                        );
                      },

                      child: Container(

                        padding:
                        const EdgeInsets.symmetric(

                          horizontal: 16,
                          vertical: 12,
                        ),

                        decoration: BoxDecoration(

                          color: isBooked
                              ? Colors.red
                              .withOpacity(0.15)
                              : Colors.green
                              .withOpacity(0.15),

                          borderRadius:
                          BorderRadius.circular(
                              14),

                          border: Border.all(

                            color: isBooked
                                ? Colors.redAccent
                                : Colors.greenAccent,
                          ),
                        ),

                        child: Column(

                          mainAxisSize:
                          MainAxisSize.min,

                          children: [

                            Text(

                              timing['time'],

                              style: TextStyle(

                                color: isBooked
                                    ? Colors.redAccent
                                    : Colors.greenAccent,

                                fontWeight:
                                FontWeight.bold,
                              ),
                            ),

                            const SizedBox(height: 6),

                            Text(

                              isBooked
                                  ? 'Occupied'
                                  : 'Available',

                              style: TextStyle(

                                color: isBooked
                                    ? Colors.redAccent
                                    : Colors.greenAccent,

                                fontSize: 11,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );

                  }).toList(),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}