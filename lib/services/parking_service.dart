import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class ParkingService extends ChangeNotifier {
  final FirebaseFirestore _firestore =
      FirebaseFirestore.instance;

  // ACTIVE BOOKING
  String? _bookedSlot;

  // ACTIVE TIME
  String? _bookedTime;

  // VEHICLE NUMBER
  String? _vehicleNumber;

  // CURRENT LOGGED STUDENT
  String? _studentName;

  // STUDENT EMAIL
  String? _studentEmail;

  // SLOT DATA
  late final List<Map<String, dynamic>> _slots;

  // HISTORY
  final List<Map<String, dynamic>> _history = [];

  // USERS
  final List<Map<String, dynamic>> _users = [];

  // ACTIVITY LOGS
  final List<String> _activityLogs = [];

  ParkingService() {

    final timings = [
      '8:00 AM',
      '9:00 AM',
      '10:00 AM',
      '11:00 AM',
      '12:00 PM',
      '1:00 PM',
      '2:00 PM',
      '3:00 PM',
    ];

    // SLOT GENERATION
    _slots = List.generate(24, (index) {

      return {

        'id': 'A-${index + 1}',

        'timings': timings.map((time) {

          return {
            'time': time,
            'isBooked': false,
          };

        }).toList(),
      };
    });
  }

  // GETTERS
  String? get bookedSlot => _bookedSlot;

  String? get bookedTime => _bookedTime;

  String? get vehicleNumber => _vehicleNumber;

  String? get studentName => _studentName;

  String? get studentEmail => _studentEmail;

  String get currentStudentName =>
      _studentName ?? '';

  List<Map<String, dynamic>> get slots => _slots;

  List<Map<String, dynamic>> get history => _history;

  List<Map<String, dynamic>> get users => _users;

  List<String> get activityLogs => _activityLogs;

  bool get hasBooking => _bookedSlot != null;

  // TOTAL SLOTS
  int get totalSlots => _slots.length;

  // OCCUPIED SLOTS
  int get occupiedSlots {

    int count = 0;

    for (var slot in _slots) {

      for (var timing in slot['timings']) {

        if (timing['isBooked'] == true) {
          count++;
        }
      }
    }

    return count;
  }

  // FREE SLOTS
  int get freeSlots => totalSlots - occupiedSlots;

  // LOGIN STUDENT
  void loginStudent(
      String name,
      String email,
      ) {

    // RESET SESSION
    _bookedSlot = null;

    _bookedTime = null;

    _vehicleNumber = null;

    _studentName = name;
    _studentEmail = email;

    _firestore.collection('students').doc(email).set({
      'name': name,
      'email': email,
      'loginTime': DateTime.now().toString(),
    });

    // FIND ACTIVE BOOKING
    for (var item in _history) {

      if (item['student'] == name &&
          item['status'] == 'Active') {

        _bookedSlot = item['slot'];

        _bookedTime = item['time'];

        _vehicleNumber = item['vehicle'];

        break;
      }
    }

    // CHECK USER EXISTS
    bool exists = _users.any(
          (u) => u['name'] == name,
    );

    // ADD USER
    if (!exists) {

      _users.add({

        'name': name,

        'email': email,

        'vehicle': '-',

        'status': 'Inactive',

        'slot': '-',
      });
    }

    notifyListeners();
  }

  // BOOK SLOT
  void bookSlot(
      String slotId,
      String time,
      String vehicleNumber,
      ) {

    if (_bookedSlot == null) {

      _bookedSlot = slotId;

      _bookedTime = time;

      _vehicleNumber = vehicleNumber;

      _firestore.collection('bookings').add({
        'student': _studentName,
        'email': _studentEmail,
        'slot': slotId,
        'time': time,
        'vehicle': vehicleNumber,
        'bookingTime': DateTime.now().toString(),
      });

      // FIND SLOT
      var slot = _slots.firstWhere(
            (s) => s['id'] == slotId,
      );

      // FIND TIMING
      var timing =
      (slot['timings'] as List).firstWhere(
            (t) => t['time'] == time,
      );

      // BOOK SLOT
      timing['isBooked'] = true;

      // UPDATE USER
      for (var user in _users) {

        if (user['name'] == _studentName) {

          user['vehicle'] = vehicleNumber;

          user['slot'] = slotId;

          user['status'] = 'Active';
        }
      }

      // HISTORY
      _history.insert(0, {

        'student': _studentName,

        'slot': slotId,

        'vehicle': vehicleNumber,

        'time': time,

        'date': DateTime.now().toString(),

        'status': 'Active',

        'duration': 'Currently Parked',
      });

      // ACTIVITY LOG
      _activityLogs.insert(
        0,
        '$_studentName booked Slot $slotId at $time',
      );

      notifyListeners();
    }
  }

  // CANCEL BOOKING BY STUDENT
  void cancelBooking() {

    if (_bookedSlot == null) {
      return;
    }

    bool found = false;

    for (var item in _history) {

      if (item['student'] == _studentName &&
          item['slot'] == _bookedSlot &&
          item['status'] == 'Active') {

        found = true;

        item['status'] = 'Cancelled';

        item['duration'] =
        'Cancelled by Student';
      }
    }

    if (!found) return;

    // FREE SLOT
    var slot = _slots.firstWhere(
          (s) => s['id'] == _bookedSlot,
    );

    var timing =
    (slot['timings'] as List).firstWhere(
          (t) => t['time'] == _bookedTime,
    );

    timing['isBooked'] = false;

    // UPDATE USER
    for (var user in _users) {

      if (user['name'] == _studentName) {

        user['slot'] = '-';

        user['vehicle'] = '-';

        user['status'] = 'Inactive';
      }
    }

    // ACTIVITY LOG
    _activityLogs.insert(
      0,
      '$_studentName cancelled Slot $_bookedSlot',
    );

    _bookedSlot = null;

    _bookedTime = null;

    _vehicleNumber = null;

    notifyListeners();
  }

  // ADMIN CANCEL BOOKING
  void cancelBookingByAdmin(
      String studentName,
      ) {

    bool bookingFound = false;

    for (var item in _history) {

      if (item['student'] == studentName &&
          item['status'] == 'Active') {

        bookingFound = true;

        item['status'] = 'Cancelled';

        item['duration'] =
        'Cancelled by Admin';

        // FREE SLOT
        var slot = _slots.firstWhere(
              (s) => s['id'] == item['slot'],
        );

        var timing =
        (slot['timings'] as List).firstWhere(
              (t) => t['time'] == item['time'],
        );

        timing['isBooked'] = false;

        // RESET CURRENT SESSION
        if (_studentName == studentName) {

          _bookedSlot = null;

          _bookedTime = null;

          _vehicleNumber = null;
        }
      }
    }

    // UPDATE USER
    for (var user in _users) {

      if (user['name'] == studentName) {

        user['slot'] = '-';

        user['vehicle'] = '-';

        user['status'] = 'Inactive';
      }
    }

    // ACTIVITY LOG
    if (bookingFound) {

      _activityLogs.insert(
        0,
        'Admin cancelled booking of $studentName',
      );
    }

    notifyListeners();
  }

  // ADMIN TOGGLE SLOT
  void toggleSlotStatus(
      String slotId,
      String time,
      ) {

    var slot = _slots.firstWhere(
          (s) => s['id'] == slotId,
    );

    var timing =
    (slot['timings'] as List).firstWhere(
          (t) => t['time'] == time,
    );

    bool currentStatus =
        timing['isBooked'] ?? false;

    // IF SLOT IS BOOKED -> CANCEL
    if (currentStatus == true) {

      timing['isBooked'] = false;

      for (var item in _history) {

        if (item['slot'] == slotId &&
            item['time'] == time &&
            item['status'] == 'Active') {

          // UPDATE HISTORY
          item['status'] = 'Cancelled';

          item['duration'] =
          'Cancelled by Admin';

          String student =
          item['student'];

          // UPDATE USERS
          for (var user in _users) {

            if (user['name'] == student) {

              user['slot'] = '-';

              user['vehicle'] = '-';

              user['status'] = 'Inactive';
            }
          }

          // RESET SESSION
          if (_studentName == student) {

            _bookedSlot = null;

            _bookedTime = null;

            _vehicleNumber = null;
          }

          // ACTIVITY LOG
          _activityLogs.insert(
            0,
            'Admin cancelled booking of $student',
          );
        }
      }

    } else {

      // ONLY MAKE SLOT AVAILABLE
      timing['isBooked'] = true;
    }

    notifyListeners();
  }
}