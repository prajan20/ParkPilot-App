import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../theme/app_theme.dart';
import '../../services/parking_service.dart';

class ParkingHistoryScreen extends StatelessWidget {
  const ParkingHistoryScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {

    final parkingService =
    Provider.of<ParkingService>(context);

    // CURRENT USER HISTORY ONLY
    final history = parkingService.history
        .where(
          (item) =>
      item['student'] ==
          parkingService.currentStudentName,
    )
        .toList();

    return Scaffold(

      backgroundColor: const Color(0xFF050B18),

      appBar: AppBar(

        backgroundColor: const Color(0xFF121A27),

        elevation: 0,

        centerTitle: true,

        title: const Text(

          'Parking History',

          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      body: history.isEmpty

          ? const Center(

        child: Text(

          'No Parking History',

          style: TextStyle(

            color: Colors.white54,

            fontSize: 18,

            fontWeight: FontWeight.bold,
          ),
        ),
      )

          : ListView.separated(

        padding: const EdgeInsets.all(16),

        itemCount: history.length,

        separatorBuilder: (_, __) =>
        const SizedBox(height: 14),

        itemBuilder: (context, index) {

          final item = history[index];

          final isCancelled =
              item['status'] == 'Cancelled';

          return AnimatedContainer(

            duration:
            const Duration(milliseconds: 300),

            padding: const EdgeInsets.all(18),

            decoration: BoxDecoration(

              color: AppTheme.surfaceColor,

              borderRadius:
              BorderRadius.circular(16),

              border: Border.all(

                color: isCancelled
                    ? AppTheme.errorColor
                    .withOpacity(0.5)
                    : AppTheme.successColor
                    .withOpacity(0.5),
              ),

              boxShadow: [

                BoxShadow(

                  color: isCancelled
                      ? AppTheme.errorColor
                      .withOpacity(0.08)
                      : AppTheme.successColor
                      .withOpacity(0.08),

                  blurRadius: 10,
                ),
              ],
            ),

            child: Row(

              children: [

                Container(

                  padding:
                  const EdgeInsets.all(14),

                  decoration: BoxDecoration(

                    color: (isCancelled
                        ? AppTheme.errorColor
                        : AppTheme.successColor)
                        .withOpacity(0.12),

                    shape: BoxShape.circle,
                  ),

                  child: Icon(

                    isCancelled
                        ? Icons.cancel
                        : Icons.local_parking,

                    size: 28,

                    color: isCancelled
                        ? AppTheme.errorColor
                        : AppTheme.successColor,
                  ),
                ),

                const SizedBox(width: 18),

                Expanded(

                  child: Column(

                    crossAxisAlignment:
                    CrossAxisAlignment.start,

                    children: [

                      Text(

                        'Slot: ${item['slot']}',

                        style: const TextStyle(

                          color: Colors.white,

                          fontSize: 20,

                          fontWeight:
                          FontWeight.bold,
                        ),
                      ),

                      const SizedBox(height: 6),

                      Text(

                        'Vehicle: ${item['vehicle'] ?? 'N/A'}',

                        style: const TextStyle(

                          color: Colors.white70,

                          fontSize: 14,
                        ),
                      ),

                      const SizedBox(height: 4),

                      Text(

                        'Timing: ${item['time'] ?? 'N/A'}',

                        style: const TextStyle(

                          color: Colors.cyanAccent,

                          fontSize: 13,

                          fontWeight:
                          FontWeight.w500,
                        ),
                      ),

                      const SizedBox(height: 4),

                      Text(

                        isCancelled
                            ? 'Booking Cancelled by Admin'
                            : 'Currently Parked',

                        style: TextStyle(

                          color: isCancelled
                              ? AppTheme.errorColor
                              : Colors.white54,

                          fontSize: 13,

                          fontWeight:
                          FontWeight.w500,
                        ),
                      ),

                      const SizedBox(height: 6),

                      Text(

                        item['date'],

                        style: const TextStyle(

                          color: Colors.white38,

                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ),

                Container(

                  padding:
                  const EdgeInsets.symmetric(

                    horizontal: 12,

                    vertical: 8,
                  ),

                  decoration: BoxDecoration(

                    color: (isCancelled
                        ? AppTheme.errorColor
                        : AppTheme.successColor)
                        .withOpacity(0.12),

                    borderRadius:
                    BorderRadius.circular(30),
                  ),

                  child: Text(

                    isCancelled
                        ? 'CANCELLED'
                        : 'ACTIVE',

                    style: TextStyle(

                      color: isCancelled
                          ? AppTheme.errorColor
                          : AppTheme.successColor,

                      fontWeight:
                      FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}