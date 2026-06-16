import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../theme/app_theme.dart';
import '../../services/parking_service.dart';

class SlotBookingScreen extends StatelessWidget {
  const SlotBookingScreen({Key? key}) : super(key: key);

  // SELECT TIMING
  void _selectTiming(
      BuildContext context,
      Map<String, dynamic> slot,
      ParkingService parkingService,
      ) {
    final timings = slot['timings'] as List;

    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.surfaceColor,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(25),
        ),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Select Timing for ${slot['id']}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 20),

                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: timings.map<Widget>((timing) {
                    final isBooked = timing['isBooked'];

                    return GestureDetector(
                      onTap: isBooked
                          ? null
                          : () {
                        Navigator.pop(context);

                        _showVehicleDialog(
                          context,
                          slot['id'],
                          timing['time'],
                          parkingService,
                        );
                      },

                      child: Container(
                        width: 110,

                        padding: const EdgeInsets.symmetric(
                          vertical: 14,
                        ),

                        decoration: BoxDecoration(
                          color: isBooked
                              ? Colors.red.withOpacity(0.15)
                              : Colors.green.withOpacity(0.12),

                          borderRadius:
                          BorderRadius.circular(14),

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

                                fontSize: 18,
                              ),
                            ),

                            const SizedBox(height: 5),

                            Text(
                              isBooked
                                  ? 'Occupied'
                                  : 'Available',

                              style: TextStyle(
                                color: isBooked
                                    ? Colors.redAccent
                                    : Colors.greenAccent,

                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ),

                const SizedBox(height: 20),
              ],
            ),
          ),
        );
      },
    );
  }

  // VEHICLE INPUT
  void _showVehicleDialog(
      BuildContext context,
      String slotId,
      String time,
      ParkingService parkingService,
      ) {
    final vehicleController =
    TextEditingController();

    showDialog(
      context: context,

      builder: (context) {
        return AlertDialog(
          backgroundColor:
          AppTheme.surfaceColor,

          shape: RoundedRectangleBorder(
            borderRadius:
            BorderRadius.circular(20),
          ),

          title: const Text(
            'Enter Vehicle Number',

            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),

          content: TextField(
            controller: vehicleController,

            style: const TextStyle(
              color: Colors.white,
            ),

            decoration: InputDecoration(
              hintText: 'TN09AB1234',

              hintStyle: const TextStyle(
                color: Colors.white38,
              ),

              filled: true,

              fillColor: Colors.black26,

              enabledBorder: OutlineInputBorder(
                borderRadius:
                BorderRadius.circular(12),

                borderSide: BorderSide(
                  color: AppTheme.primaryColor,
                ),
              ),

              focusedBorder: OutlineInputBorder(
                borderRadius:
                BorderRadius.circular(12),

                borderSide: BorderSide(
                  color: AppTheme.primaryColor,
                  width: 2,
                ),
              ),
            ),
          ),

          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },

              child: const Text(
                'Cancel',

                style: TextStyle(
                  color: Colors.white70,
                ),
              ),
            ),

            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor:
                AppTheme.primaryColor,
              ),

              onPressed: () {
                final vehicle =
                vehicleController.text.trim();

                if (vehicle.isEmpty) {
                  ScaffoldMessenger.of(context)
                      .showSnackBar(
                    const SnackBar(
                      content:
                      Text('Enter vehicle number'),
                    ),
                  );

                  return;
                }

                // BOOK SLOT
                parkingService.bookSlot(
                  slotId,
                  time,
                  vehicle,
                );

                Navigator.pop(context);

                // SUCCESS POPUP
                showDialog(
                  context: context,
                  builder: (context) {
                    return AlertDialog(
                      backgroundColor:
                      AppTheme.surfaceColor,

                      shape: RoundedRectangleBorder(
                        borderRadius:
                        BorderRadius.circular(20),
                      ),

                      title: Column(
                        children: const [
                          Icon(
                            Icons.check_circle,
                            color: Colors.greenAccent,
                            size: 60,
                          ),

                          SizedBox(height: 12),

                          Text(
                            'Booking Successful',

                            style: TextStyle(
                              color: Colors.white,
                              fontWeight:
                              FontWeight.bold,
                            ),
                          ),
                        ],
                      ),

                      content: Column(
                        mainAxisSize:
                        MainAxisSize.min,

                        children: [
                          Text(
                            'Slot: $slotId',

                            style: const TextStyle(
                              color:
                              Colors.cyanAccent,

                              fontSize: 22,

                              fontWeight:
                              FontWeight.bold,
                            ),
                          ),

                          const SizedBox(height: 10),

                          Text(
                            'Timing: $time',

                            style: const TextStyle(
                              color: Colors.white70,
                            ),
                          ),

                          const SizedBox(height: 6),

                          Text(
                            'Vehicle: $vehicle',

                            style: const TextStyle(
                              color: Colors.white54,
                            ),
                          ),
                        ],
                      ),

                      actions: [
                        Center(
                          child: ElevatedButton(
                            style:
                            ElevatedButton.styleFrom(
                              backgroundColor:
                              AppTheme.primaryColor,
                            ),

                            onPressed: () {
                              Navigator.pop(context);
                            },

                            child: const Text('OK'),
                          ),
                        ),
                      ],
                    );
                  },
                );
              },

              child: const Text('Book'),
            ),
          ],
        );
      },
    );
  }

  // CANCEL BOOKING
  void _cancelBooking(
      BuildContext context,
      ParkingService parkingService,
      ) {
    parkingService.cancelBooking();

    ScaffoldMessenger.of(context)
        .showSnackBar(
      const SnackBar(
        content:
        Text('Booking Cancelled'),

        backgroundColor: Colors.orange,

        behavior:
        SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final parkingService =
    Provider.of<ParkingService>(context);

    final slots =
        parkingService.slots;

    final screenWidth =
        MediaQuery.of(context).size.width;

    int crossAxisCount = 4;

    if (screenWidth < 600) {
      crossAxisCount = 2;
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Book a Slot'),
      ),

      body: Padding(
        padding: const EdgeInsets.all(16),

        child: Column(
          children: [
            // ACTIVE BOOKING CARD
            if (parkingService.hasBooking)

              Container(
                width: double.infinity,

                margin:
                const EdgeInsets.only(bottom: 20),

                padding:
                const EdgeInsets.all(18),

                decoration: BoxDecoration(
                  borderRadius:
                  BorderRadius.circular(20),

                  border: Border.all(
                    color: AppTheme.primaryColor,
                  ),

                  color: AppTheme.primaryColor
                      .withOpacity(0.1),
                ),

                child: Column(
                  crossAxisAlignment:
                  CrossAxisAlignment.start,

                  children: [
                    const Text(
                      'Your Active Booking',

                      style: TextStyle(
                        color: Colors.white70,
                      ),
                    ),

                    const SizedBox(height: 10),

                    Text(
                      'Slot ${parkingService.bookedSlot}',

                      style: const TextStyle(
                        color:
                        AppTheme.primaryColor,

                        fontSize: 28,

                        fontWeight:
                        FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 10),

                    Text(
                      'Time: ${parkingService.bookedTime}',

                      style: const TextStyle(
                        color: Colors.cyanAccent,
                      ),
                    ),

                    const SizedBox(height: 6),

                    Text(
                      'Vehicle: ${parkingService.vehicleNumber}',

                      style: const TextStyle(
                        color: Colors.white60,
                      ),
                    ),

                    const SizedBox(height: 18),

                    SizedBox(
                      width: double.infinity,

                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor:
                          Colors.redAccent,

                          padding:
                          const EdgeInsets.symmetric(
                            vertical: 14,
                          ),
                        ),

                        onPressed: () {
                          _cancelBooking(
                            context,
                            parkingService,
                          );
                        },

                        child:
                        const Text('Cancel Booking'),
                      ),
                    ),
                  ],
                ),
              ),

            // SLOT GRID
            Expanded(
              child: GridView.builder(
                itemCount: slots.length,

                gridDelegate:
                SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount:
                  crossAxisCount,

                  crossAxisSpacing: 14,

                  mainAxisSpacing: 14,

                  childAspectRatio:
                  screenWidth < 600 ? 1.1 : 0.95,
                ),

                itemBuilder: (context, index) {
                  final slot = slots[index];

                  return GestureDetector(
                    onTap: () {
                      if (!parkingService.hasBooking) {
                        _selectTiming(
                          context,
                          slot,
                          parkingService,
                        );
                      } else {
                        ScaffoldMessenger.of(context)
                            .showSnackBar(
                          const SnackBar(
                            content: Text(
                              'You already booked a slot',
                            ),
                          ),
                        );
                      }
                    },

                    child: AnimatedContainer(
                      duration:
                      const Duration(milliseconds: 300),

                      decoration: BoxDecoration(
                        borderRadius:
                        BorderRadius.circular(18),

                        border: Border.all(
                          color: AppTheme.primaryColor
                              .withOpacity(0.5),
                        ),

                        color: AppTheme.secondaryColor
                            .withOpacity(0.08),
                      ),

                      child: Center(
                        child: Text(
                          slot['id'],

                          style: TextStyle(
                            color:
                            AppTheme.primaryColor,

                            fontSize:
                            screenWidth < 600
                                ? 32
                                : 28,

                            fontWeight:
                            FontWeight.bold,
                          ),
                        ),
                      ),
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