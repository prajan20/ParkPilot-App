import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';

import '../../services/parking_service.dart';

class QRPassScreen extends StatelessWidget {
  const QRPassScreen({super.key});

  @override
  Widget build(BuildContext context) {

    final parkingService =
    Provider.of<ParkingService>(context);

    return Scaffold(

      backgroundColor: const Color(0xFF050B18),

      appBar: AppBar(

        backgroundColor: const Color(0xFF111827),

        elevation: 0,

        centerTitle: true,

        title: const Text(

          'QR Parking Pass',

          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
      ),

      body: SingleChildScrollView(

        child: Center(

          child: parkingService.bookedSlot == null

              ? const Padding(

            padding: EdgeInsets.only(top: 120),

            child: Column(

              children: [

                Icon(
                  Icons.cancel,
                  size: 80,
                  color: Colors.redAccent,
                ),

                SizedBox(height: 20),

                Text(

                  'No Active Booking',

                  style: TextStyle(

                    color: Colors.redAccent,

                    fontSize: 24,

                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          )

              : Container(

            width: 420,

            margin: const EdgeInsets.all(20),

            padding: const EdgeInsets.all(25),

            decoration: BoxDecoration(

              color: const Color(0xFF111827),

              borderRadius: BorderRadius.circular(30),

              border: Border.all(
                color: Colors.cyanAccent,
                width: 1.5,
              ),

              boxShadow: [

                BoxShadow(
                  color: Colors.cyanAccent.withOpacity(0.15),
                  blurRadius: 20,
                  spreadRadius: 2,
                )
              ],
            ),

            child: Column(

              mainAxisSize: MainAxisSize.min,

              children: [

                // HEADER
                Row(

                  mainAxisAlignment:
                  MainAxisAlignment.spaceBetween,

                  children: [

                    const Text(

                      'PARKPILOT PASS',

                      style: TextStyle(

                        color: Colors.white70,

                        fontSize: 14,

                        letterSpacing: 2,

                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    Container(

                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),

                      decoration: BoxDecoration(

                        color: Colors.green.withOpacity(0.2),

                        borderRadius:
                        BorderRadius.circular(20),
                      ),

                      child: const Text(

                        'ACTIVE',

                        style: TextStyle(

                          color: Colors.greenAccent,

                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    )
                  ],
                ),

                const SizedBox(height: 30),

                // PARKING ICON
                const Icon(

                  Icons.local_parking,

                  size: 80,

                  color: Colors.cyanAccent,
                ),

                const SizedBox(height: 20),

                // SLOT
                Text(

                  parkingService.bookedSlot!,

                  style: const TextStyle(

                    color: Colors.cyanAccent,

                    fontSize: 42,

                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 10),

                // TIMING
                Text(

                  'Timing: ${parkingService.bookedTime ?? 'N/A'}',

                  style: const TextStyle(

                    color: Colors.white70,

                    fontSize: 18,
                  ),
                ),

                const SizedBox(height: 8),

                // VEHICLE
                Text(

                  'Vehicle: ${parkingService.vehicleNumber ?? 'N/A'}',

                  style: const TextStyle(

                    color: Colors.white54,

                    fontSize: 16,
                  ),
                ),

                const SizedBox(height: 8),

                // STUDENT NAME
                Text(

                  'Student: ${parkingService.studentName ?? 'Student'}',

                  style: const TextStyle(

                    color: Colors.white54,

                    fontSize: 16,
                  ),
                ),

                const SizedBox(height: 30),

                // QR CODE
                Container(

                  padding: const EdgeInsets.all(15),

                  decoration: BoxDecoration(

                    color: Colors.white,

                    borderRadius:
                    BorderRadius.circular(20),
                  ),

                  child: QrImageView(

                    data:
                    '${parkingService.studentName} | ${parkingService.bookedSlot} | ${parkingService.bookedTime}',

                    version: QrVersions.auto,

                    size: 220,
                  ),
                ),

                const SizedBox(height: 30),

                const Text(

                  'Scan this QR at parking entrance',

                  style: TextStyle(

                    color: Colors.white60,

                    fontSize: 15,
                  ),
                ),

                const SizedBox(height: 10),

                const Divider(
                  color: Colors.white24,
                ),

                const SizedBox(height: 10),

                const Text(

                  'Smart Parking Management System',

                  style: TextStyle(
                    color: Colors.white38,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}