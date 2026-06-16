import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../services/parking_service.dart';

class ActivityLogsScreen extends StatelessWidget {
  const ActivityLogsScreen({super.key});

  @override
  Widget build(BuildContext context) {

    final parkingService =
    Provider.of<ParkingService>(context);

    final logs = parkingService.history;

    return Scaffold(

      backgroundColor: const Color(0xFF050B18),

      appBar: AppBar(

        backgroundColor: const Color(0xFF123441),

        elevation: 0,

        centerTitle: true,

        title: const Text(

          'Activity Logs',

          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      body: logs.isEmpty

          ? const Center(

        child: Column(

          mainAxisAlignment:
          MainAxisAlignment.center,

          children: [

            Icon(
              Icons.history,
              size: 90,
              color: Colors.white24,
            ),

            SizedBox(height: 20),

            Text(

              'No Activity Found',

              style: TextStyle(

                color: Colors.white54,

                fontSize: 24,

                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      )

          : ListView.builder(

        padding: const EdgeInsets.all(20),

        itemCount: logs.length,

        itemBuilder: (context, index) {

          final log = logs[index];

          final isCancelled =
              log['status'] == 'Cancelled';

          return Container(

            margin:
            const EdgeInsets.only(bottom: 20),

            padding:
            const EdgeInsets.all(20),

            decoration: BoxDecoration(

              color: const Color(0xFF111827),

              borderRadius:
              BorderRadius.circular(25),

              border: Border.all(

                color: isCancelled
                    ? Colors.redAccent
                    : Colors.greenAccent,

                width: 1.2,
              ),

              boxShadow: [

                BoxShadow(

                  color: (isCancelled
                      ? Colors.redAccent
                      : Colors.greenAccent)
                      .withOpacity(0.08),

                  blurRadius: 15,

                  spreadRadius: 1,
                ),
              ],
            ),

            child: Row(

              crossAxisAlignment:
              CrossAxisAlignment.start,

              children: [

                Container(

                  padding:
                  const EdgeInsets.all(15),

                  decoration: BoxDecoration(

                    color: isCancelled
                        ? Colors.red
                        .withOpacity(0.15)
                        : Colors.green
                        .withOpacity(0.15),

                    shape: BoxShape.circle,
                  ),

                  child: Icon(

                    isCancelled
                        ? Icons.cancel
                        : Icons.check_circle,

                    color: isCancelled
                        ? Colors.redAccent
                        : Colors.greenAccent,

                    size: 32,
                  ),
                ),

                const SizedBox(width: 20),

                Expanded(

                  child: Column(

                    crossAxisAlignment:
                    CrossAxisAlignment.start,

                    children: [

                      Text(

                        log['student'] ??
                            'Student',

                        style: const TextStyle(

                          color: Colors.white,

                          fontSize: 24,

                          fontWeight:
                          FontWeight.bold,
                        ),
                      ),

                      const SizedBox(height: 10),

                      Text(

                        'Slot: ${log['slot']}',

                        style: const TextStyle(

                          color:
                          Colors.cyanAccent,

                          fontSize: 17,
                        ),
                      ),

                      const SizedBox(height: 5),

                      Text(

                        'Vehicle: ${log['vehicle']}',

                        style: const TextStyle(

                          color: Colors.white70,

                          fontSize: 16,
                        ),
                      ),

                      const SizedBox(height: 5),

                      Text(

                        'Timing: ${log['time']}',

                        style: const TextStyle(

                          color: Colors.white60,

                          fontSize: 15,
                        ),
                      ),

                      const SizedBox(height: 5),

                      Text(

                        isCancelled
                            ? 'Status: Cancelled by Admin'
                            : 'Status: Active',

                        style: TextStyle(

                          color: isCancelled
                              ? Colors.redAccent
                              : Colors.greenAccent,

                          fontSize: 15,

                          fontWeight:
                          FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),

                Container(

                  padding:
                  const EdgeInsets.symmetric(
                    horizontal: 14,
                    vertical: 8,
                  ),

                  decoration: BoxDecoration(

                    color: isCancelled
                        ? Colors.red
                        .withOpacity(0.15)
                        : Colors.green
                        .withOpacity(0.15),

                    borderRadius:
                    BorderRadius.circular(20),
                  ),

                  child: Text(

                    isCancelled
                        ? 'CANCELLED'
                        : 'ACTIVE',

                    style: TextStyle(

                      color: isCancelled
                          ? Colors.redAccent
                          : Colors.greenAccent,

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