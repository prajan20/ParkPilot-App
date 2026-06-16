import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../services/parking_service.dart';
import '../../theme/app_theme.dart';

class ParkingAnalyticsScreen extends StatelessWidget {
  const ParkingAnalyticsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final parkingService =
    Provider.of<ParkingService>(context);

    final slots = parkingService.slots;

    final totalSlots = slots.length;

    int occupiedSlots = 0;

    for (var slot in slots) {
      final timings =
      slot['timings'] as List;

      bool occupied = timings.any(
            (timing) =>
        timing['isBooked'] == true,
      );

      if (occupied) {
        occupiedSlots++;
      }
    }

    final freeSlots =
        totalSlots - occupiedSlots;

    final occupancyRate =
    ((occupiedSlots / totalSlots) * 100);

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Parking Analytics',
        ),
      ),

      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),

        child: Column(
          crossAxisAlignment:
          CrossAxisAlignment.start,

          children: [

            const Text(
              'Analytics Overview',

              style: TextStyle(
                color: Colors.white,
                fontSize: 30,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 24),

            LayoutBuilder(
              builder: (context, constraints) {

                int crossAxisCount = 2;

                if (constraints.maxWidth < 700) {
                  crossAxisCount = 1;
                }

                return GridView.count(
                  shrinkWrap: true,

                  physics:
                  const NeverScrollableScrollPhysics(),

                  crossAxisCount:
                  crossAxisCount,

                  crossAxisSpacing: 16,

                  mainAxisSpacing: 16,

                  childAspectRatio: 1.5,

                  children: [

                    _buildAnalyticsCard(
                      title: 'Total Slots',
                      value: '$totalSlots',
                      icon: Icons.local_parking,
                      color: Colors.blueAccent,
                    ),

                    _buildAnalyticsCard(
                      title: 'Occupied Slots',
                      value: '$occupiedSlots',
                      icon: Icons.directions_car,
                      color: Colors.redAccent,
                    ),

                    _buildAnalyticsCard(
                      title: 'Free Slots',
                      value: '$freeSlots',
                      icon: Icons.check_circle,
                      color: Colors.greenAccent,
                    ),

                    _buildAnalyticsCard(
                      title: 'Occupancy Rate',
                      value:
                      '${occupancyRate.toStringAsFixed(1)}%',
                      icon: Icons.pie_chart,
                      color: Colors.purpleAccent,
                    ),
                  ],
                );
              },
            ),

            const SizedBox(height: 35),

            // PIE CHART
            Container(
              width: double.infinity,

              padding: const EdgeInsets.all(20),

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
                children: [

                  const Text(
                    'Slot Occupancy',

                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 30),

                  SizedBox(
                    height: 260,

                    child: PieChart(

                      PieChartData(

                        sectionsSpace: 4,

                        centerSpaceRadius: 55,

                        sections: [

                          PieChartSectionData(
                            value:
                            occupiedSlots.toDouble(),

                            color: Colors.redAccent,

                            radius: 90,

                            title:
                            '$occupiedSlots',

                            titleStyle:
                            const TextStyle(
                              color: Colors.white,
                              fontWeight:
                              FontWeight.bold,
                              fontSize: 18,
                            ),
                          ),

                          PieChartSectionData(
                            value:
                            freeSlots.toDouble(),

                            color:
                            Colors.greenAccent,

                            radius: 90,

                            title:
                            '$freeSlots',

                            titleStyle:
                            const TextStyle(
                              color: Colors.black,
                              fontWeight:
                              FontWeight.bold,
                              fontSize: 18,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 20),

                  Row(
                    mainAxisAlignment:
                    MainAxisAlignment.center,

                    children: [

                      _buildLegend(
                        Colors.redAccent,
                        'Occupied',
                      ),

                      const SizedBox(width: 30),

                      _buildLegend(
                        Colors.greenAccent,
                        'Free',
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 35),

            // BAR GRAPH
            Container(
              width: double.infinity,

              padding: const EdgeInsets.all(20),

              decoration: BoxDecoration(
                color: AppTheme.surfaceColor,

                borderRadius:
                BorderRadius.circular(20),

                border: Border.all(
                  color: Colors.cyanAccent
                      .withOpacity(0.3),
                ),
              ),

              child: Column(
                children: [

                  const Text(
                    'Parking Statistics',

                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 30),

                  SizedBox(
                    height: 280,

                    child: BarChart(

                      BarChartData(

                        alignment:
                        BarChartAlignment.spaceAround,

                        maxY:
                        totalSlots.toDouble(),

                        titlesData:
                        FlTitlesData(

                          // LEFT NUMBERS REMOVED
                          leftTitles:
                          const AxisTitles(
                            sideTitles:
                            SideTitles(
                              showTitles: false,
                            ),
                          ),

                          rightTitles:
                          const AxisTitles(
                            sideTitles:
                            SideTitles(
                              showTitles: false,
                            ),
                          ),

                          topTitles:
                          const AxisTitles(
                            sideTitles:
                            SideTitles(
                              showTitles: false,
                            ),
                          ),

                          bottomTitles:
                          AxisTitles(

                            sideTitles:
                            SideTitles(

                              showTitles: true,

                              getTitlesWidget:
                                  (value, meta) {

                                switch (
                                value.toInt()) {

                                  case 0:
                                    return const Text(
                                      'Total',
                                      style: TextStyle(
                                        color:
                                        Colors.white,
                                      ),
                                    );

                                  case 1:
                                    return const Text(
                                      'Occupied',
                                      style: TextStyle(
                                        color:
                                        Colors.white,
                                      ),
                                    );

                                  case 2:
                                    return const Text(
                                      'Free',
                                      style: TextStyle(
                                        color:
                                        Colors.white,
                                      ),
                                    );
                                }

                                return const Text('');
                              },
                            ),
                          ),
                        ),

                        borderData:
                        FlBorderData(show: false),

                        gridData: FlGridData(
                          show: true,
                          drawVerticalLine: true,
                          horizontalInterval: 5,
                          getDrawingHorizontalLine:
                              (value) {
                            return FlLine(
                              color: Colors.white10,
                              strokeWidth: 1,
                            );
                          },
                          getDrawingVerticalLine:
                              (value) {
                            return FlLine(
                              color: Colors.white10,
                              strokeWidth: 1,
                            );
                          },
                        ),

                        barGroups: [

                          BarChartGroupData(
                            x: 0,

                            barRods: [

                              BarChartRodData(
                                toY:
                                totalSlots.toDouble(),

                                color:
                                Colors.blueAccent,

                                width: 35,

                                borderRadius:
                                BorderRadius.circular(8),
                              ),
                            ],
                          ),

                          BarChartGroupData(
                            x: 1,

                            barRods: [

                              BarChartRodData(
                                toY:
                                occupiedSlots.toDouble(),

                                color:
                                Colors.redAccent,

                                width: 35,

                                borderRadius:
                                BorderRadius.circular(8),
                              ),
                            ],
                          ),

                          BarChartGroupData(
                            x: 2,

                            barRods: [

                              BarChartRodData(
                                toY:
                                freeSlots.toDouble(),

                                color:
                                Colors.greenAccent,

                                width: 35,

                                borderRadius:
                                BorderRadius.circular(8),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 35),

            // SYSTEM STATUS
            Container(
              width: double.infinity,

              padding: const EdgeInsets.all(20),

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

                  const Text(
                    'System Status',

                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 20),

                  _buildStatusRow(
                    'Parking System',
                    'Active',
                    Colors.greenAccent,
                  ),

                  const SizedBox(height: 14),

                  _buildStatusRow(
                    'Live Monitoring',
                    'Running',
                    Colors.cyanAccent,
                  ),

                  const SizedBox(height: 14),

                  _buildStatusRow(
                    'Database',
                    'Connected',
                    Colors.orangeAccent,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLegend(
      Color color,
      String text,
      ) {

    return Row(
      children: [

        Container(
          width: 18,
          height: 18,

          decoration: BoxDecoration(
            color: color,
            borderRadius:
            BorderRadius.circular(5),
          ),
        ),

        const SizedBox(width: 8),

        Text(
          text,

          style: const TextStyle(
            color: Colors.white,
            fontSize: 16,
          ),
        ),
      ],
    );
  }

  Widget _buildAnalyticsCard({

    required String title,

    required String value,

    required IconData icon,

    required Color color,
  }) {

    return Container(

      padding: const EdgeInsets.all(20),

      decoration: BoxDecoration(

        color: AppTheme.surfaceColor,

        borderRadius:
        BorderRadius.circular(20),

        border: Border.all(
          color: color.withOpacity(0.3),
        ),

        boxShadow: [

          BoxShadow(
            color: color.withOpacity(0.08),
            blurRadius: 12,
            spreadRadius: 1,
          ),
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

          const SizedBox(height: 16),

          Text(

            value,

            style: TextStyle(
              color: color,
              fontSize: 34,
              fontWeight: FontWeight.bold,
            ),
          ),

          const SizedBox(height: 8),

          Text(

            title,

            textAlign: TextAlign.center,

            style: const TextStyle(
              color: Colors.white70,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusRow(
      String title,
      String status,
      Color color,
      ) {

    return Row(

      mainAxisAlignment:
      MainAxisAlignment.spaceBetween,

      children: [

        Text(

          title,

          style: const TextStyle(
            color: Colors.white70,
            fontSize: 16,
          ),
        ),

        Container(

          padding:
          const EdgeInsets.symmetric(
            horizontal: 14,
            vertical: 8,
          ),

          decoration: BoxDecoration(

            color: color.withOpacity(0.15),

            borderRadius:
            BorderRadius.circular(30),
          ),

          child: Text(

            status,

            style: TextStyle(
              color: color,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ],
    );
  }
}