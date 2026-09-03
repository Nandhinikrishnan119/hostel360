package com.hostel360.config;

import com.hostel360.entity.*;
import com.hostel360.entity.enums.*;
import com.hostel360.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final HostelRepository hostelRepository;
    private final BlockRepository blockRepository;
    private final RoomRepository roomRepository;
    private final BedRepository bedRepository;
    private final StudentRepository studentRepository;
    private final StaffProfileRepository staffProfileRepository;
    private final ComplaintCategoryRepository complaintCategoryRepository;
    private final ComplaintRepository complaintRepository;
    private final ComplaintCommentRepository complaintCommentRepository;
    private final FoodMenuRepository foodMenuRepository;
    private final FoodReservationRepository foodReservationRepository;
    private final FoodRatingRepository foodRatingRepository;
    private final FoodComplaintRepository foodComplaintRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final LateEntryRepository lateEntryRepository;
    private final HealthRecordRepository healthRecordRepository;
    private final SuggestionRepository suggestionRepository;
    private final AnnouncementRepository announcementRepository;
    private final ParcelRepository parcelRepository;
    private final EmergencyReportRepository emergencyReportRepository;
    private final NotificationRepository notificationRepository;
    private final WeeklyFeedbackRepository weeklyFeedbackRepository;
    private final PaymentRepository paymentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Verifying payments...");
            seedPaymentsIfEmpty();
            return;
        }

        log.info("Starting Hostel360 initial realistic seed data generation for Girls Hostels...");

        // 1. Seed Roles
        for (RoleType roleType : RoleType.values()) {
            roleRepository.save(Role.builder().name(roleType).build());
        }

        // 2. Seed Departments
        Department cse = departmentRepository.save(Department.builder().name("Computer Science & Engineering").code("CSE").build());
        Department ece = departmentRepository.save(Department.builder().name("Electronics & Communication Engineering").code("ECE").build());
        Department mech = departmentRepository.save(Department.builder().name("Mechanical Engineering").code("MECH").build());
        Department it = departmentRepository.save(Department.builder().name("Information Technology").code("IT").build());

        // 3. Seed Users for each Role
        String defaultPw = passwordEncoder.encode("admin123");
        String studentPw = passwordEncoder.encode("student123");
        String wardenPw = passwordEncoder.encode("warden123");
        String maintPw = passwordEncoder.encode("maint123");
        String messPw = passwordEncoder.encode("mess123");
        String secPw = passwordEncoder.encode("security123");

        User adminUser = userRepository.save(User.builder()
                .username("admin")
                .email("admin@hostel360.com")
                .password(defaultPw)
                .fullName("Dr. Rajesh Sharma (Chief Administrator)")
                .phone("+91 9876543210")
                .role(RoleType.ROLE_SUPER_ADMIN)
                .status(UserStatus.ACTIVE)
                .build());

        User wardenUser1 = userRepository.save(User.builder()
                .username("warden1")
                .email("warden.kaveri@hostel360.com")
                .password(wardenPw)
                .fullName("Dr. Anandita Kumar (Senior Warden)")
                .phone("+91 9876543211")
                .role(RoleType.ROLE_WARDEN)
                .status(UserStatus.ACTIVE)
                .build());

        User wardenUser2 = userRepository.save(User.builder()
                .username("warden2")
                .email("warden.ganga@hostel360.com")
                .password(wardenPw)
                .fullName("Dr. Meenakshi Sundaram (Hostel Warden)")
                .phone("+91 9876543212")
                .role(RoleType.ROLE_WARDEN)
                .status(UserStatus.ACTIVE)
                .build());

        User maintUser1 = userRepository.save(User.builder()
                .username("maint1")
                .email("maint.elec@hostel360.com")
                .password(maintPw)
                .fullName("Ramesh Patel (Senior Electrician)")
                .phone("+91 9876543213")
                .role(RoleType.ROLE_MAINTENANCE_STAFF)
                .status(UserStatus.ACTIVE)
                .build());

        User maintUser2 = userRepository.save(User.builder()
                .username("maint2")
                .email("maint.plumb@hostel360.com")
                .password(maintPw)
                .fullName("Suresh Verma (Lead Plumber)")
                .phone("+91 9876543214")
                .role(RoleType.ROLE_MAINTENANCE_STAFF)
                .status(UserStatus.ACTIVE)
                .build());

        User messUser = userRepository.save(User.builder()
                .username("mess1")
                .email("mess.manager@hostel360.com")
                .password(messPw)
                .fullName("Chef Vikram Singh (Mess Head)")
                .phone("+91 9876543215")
                .role(RoleType.ROLE_MESS_MANAGER)
                .status(UserStatus.ACTIVE)
                .build());

        User securityUser = userRepository.save(User.builder()
                .username("security1")
                .email("gate.security@hostel360.com")
                .password(secPw)
                .fullName("Subedar Priya Sharma (Security Head)")
                .phone("+91 9876543216")
                .role(RoleType.ROLE_SECURITY_STAFF)
                .status(UserStatus.ACTIVE)
                .build());

        // 4. Seed Hostels & Blocks (Both Girls Hostels)
        Hostel hostelA = hostelRepository.save(Hostel.builder()
                .name("Kaveri Girls Hostel")
                .code("KGH-01")
                .genderType(GenderType.GIRLS)
                .totalCapacity(300)
                .warden(wardenUser1)
                .description("Premier girls residence complex with high-speed Wi-Fi mesh, study lounges, and 24x7 security.")
                .build());

        Hostel hostelB = hostelRepository.save(Hostel.builder()
                .name("Ganga Girls Hostel")
                .code("GGH-01")
                .genderType(GenderType.GIRLS)
                .totalCapacity(250)
                .warden(wardenUser2)
                .description("Modern girls residence hall with dedicated study cubicles, indoor recreation, and solar water heating.")
                .build());

        // Staff Profiles
        staffProfileRepository.save(StaffProfile.builder().user(wardenUser1).assignedHostel(hostelA).designation("Senior Hostel Warden").build());
        staffProfileRepository.save(StaffProfile.builder().user(wardenUser2).assignedHostel(hostelB).designation("Hostel Warden").build());
        staffProfileRepository.save(StaffProfile.builder().user(maintUser1).assignedHostel(hostelA).designation("Maintenance Electrician").specialization("Electrical").build());
        staffProfileRepository.save(StaffProfile.builder().user(maintUser2).assignedHostel(hostelA).designation("Maintenance Plumber").specialization("Plumbing").build());
        staffProfileRepository.save(StaffProfile.builder().user(messUser).assignedHostel(hostelA).designation("Chief Mess Supervisor").build());
        staffProfileRepository.save(StaffProfile.builder().user(securityUser).assignedHostel(hostelA).designation("Chief Security Guard").build());

        // Blocks
        Block blockA = blockRepository.save(Block.builder().hostel(hostelA).name("Block A (Junior Wing)").totalFloors(4).build());
        Block blockB = blockRepository.save(Block.builder().hostel(hostelA).name("Block B (Senior Wing)").totalFloors(4).build());
        Block blockC = blockRepository.save(Block.builder().hostel(hostelB).name("Block C (Central)").totalFloors(4).build());

        // Rooms & Beds for Block B
        Room roomB204 = roomRepository.save(Room.builder()
                .block(blockB)
                .roomNumber("B-204")
                .floor(2)
                .capacity(4)
                .currentOccupancy(3)
                .roomType(RoomType.AC)
                .status(RoomStatus.AVAILABLE)
                .build());

        Bed bedA = bedRepository.save(Bed.builder().room(roomB204).bedLabel("A").isOccupied(true).build());
        Bed bedB = bedRepository.save(Bed.builder().room(roomB204).bedLabel("B").isOccupied(true).build());
        Bed bedC = bedRepository.save(Bed.builder().room(roomB204).bedLabel("C").isOccupied(true).build());
        Bed bedD = bedRepository.save(Bed.builder().room(roomB204).bedLabel("D").isOccupied(false).build());

        Room roomB201 = roomRepository.save(Room.builder().block(blockB).roomNumber("B-201").floor(2).capacity(4).currentOccupancy(4).status(RoomStatus.FULL).build());
        Room roomB202 = roomRepository.save(Room.builder().block(blockB).roomNumber("B-202").floor(2).capacity(4).currentOccupancy(2).status(RoomStatus.AVAILABLE).build());
        Room roomA101 = roomRepository.save(Room.builder().block(blockA).roomNumber("A-101").floor(1).capacity(2).currentOccupancy(1).status(RoomStatus.AVAILABLE).build());
        Bed bedA101_A = bedRepository.save(Bed.builder().room(roomA101).bedLabel("A").isOccupied(true).build());
        bedRepository.save(Bed.builder().room(roomA101).bedLabel("B").isOccupied(false).build());

        // 5. Seed Female Students
        User studentUser1 = userRepository.save(User.builder()
                .username("student1")
                .email("ananya.sundar@hostel360.com")
                .password(studentPw)
                .fullName("Ananya Sundar")
                .phone("+91 9443322110")
                .role(RoleType.ROLE_STUDENT)
                .status(UserStatus.ACTIVE)
                .build());

        Student student1 = studentRepository.save(Student.builder()
                .user(studentUser1)
                .studentId("23CS101")
                .department(cse)
                .yearOfStudy(3)
                .hostel(hostelA)
                .block(blockB)
                .room(roomB204)
                .bed(bedA)
                .parentName("M. Sundaram")
                .parentPhone("+91 9443322199")
                .emergencyContact("+91 9443322199")
                .joiningDate(LocalDate.of(2023, 8, 1))
                .bloodGroup("O+")
                .build());

        User studentUser2 = userRepository.save(User.builder()
                .username("student2")
                .email("pooja.chawla@hostel360.com")
                .password(studentPw)
                .fullName("Pooja Chawla")
                .phone("+91 9443322111")
                .role(RoleType.ROLE_STUDENT)
                .status(UserStatus.ACTIVE)
                .build());

        Student student2 = studentRepository.save(Student.builder()
                .user(studentUser2)
                .studentId("23CS102")
                .department(cse)
                .yearOfStudy(3)
                .hostel(hostelA)
                .block(blockB)
                .room(roomB204)
                .bed(bedB)
                .parentName("K. Chawla")
                .parentPhone("+91 9443322198")
                .emergencyContact("+91 9443322198")
                .joiningDate(LocalDate.of(2023, 8, 1))
                .bloodGroup("B+")
                .build());

        User studentUser3 = userRepository.save(User.builder()
                .username("student3")
                .email("kavya.nambiar@hostel360.com")
                .password(studentPw)
                .fullName("Kavya Nambiar")
                .phone("+91 9443322112")
                .role(RoleType.ROLE_STUDENT)
                .status(UserStatus.ACTIVE)
                .build());

        Student student3 = studentRepository.save(Student.builder()
                .user(studentUser3)
                .studentId("23IT205")
                .department(it)
                .yearOfStudy(2)
                .hostel(hostelA)
                .block(blockA)
                .room(roomA101)
                .bed(bedA101_A)
                .parentName("S. Nambiar")
                .parentPhone("+91 9443322197")
                .emergencyContact("+91 9443322197")
                .joiningDate(LocalDate.of(2024, 8, 1))
                .bloodGroup("A+")
                .build());

        // 6. Seed Complaint Categories
        ComplaintCategory catElec = complaintCategoryRepository.save(ComplaintCategory.builder().name("Electrical").code("ELEC").defaultPriority(PriorityLevel.HIGH).slaHoursLow(48).slaHoursMedium(24).slaHoursHigh(12).slaHoursCritical(4).description("Lights, fans, switches, sockets, geysers").build());
        ComplaintCategory catPlumb = complaintCategoryRepository.save(ComplaintCategory.builder().name("Plumbing").code("PLUMB").defaultPriority(PriorityLevel.HIGH).slaHoursLow(48).slaHoursMedium(24).slaHoursHigh(12).slaHoursCritical(4).description("Taps, pipes, leaks, flush, drainage").build());
        ComplaintCategory catWifi = complaintCategoryRepository.save(ComplaintCategory.builder().name("Wi-Fi & Internet").code("WIFI").defaultPriority(PriorityLevel.MEDIUM).slaHoursLow(72).slaHoursMedium(48).slaHoursHigh(24).slaHoursCritical(6).description("Access points, signal drops, LAN ports").build());
        ComplaintCategory catClean = complaintCategoryRepository.save(ComplaintCategory.builder().name("Cleanliness").code("CLEAN").defaultPriority(PriorityLevel.LOW).slaHoursLow(24).slaHoursMedium(12).slaHoursHigh(6).slaHoursCritical(2).description("Room sweeping, washroom disinfection, waste bins").build());
        ComplaintCategory catCarp = complaintCategoryRepository.save(ComplaintCategory.builder().name("Carpentry").code("CARP").defaultPriority(PriorityLevel.LOW).slaHoursLow(72).slaHoursMedium(48).slaHoursHigh(24).slaHoursCritical(8).description("Doors, cupboard locks, study tables, cots").build());

        // 7. Seed Complaints with SLA
        Complaint c1 = complaintRepository.save(Complaint.builder()
                .complaintNumber("CMP-2026-0001")
                .student(student1)
                .hostel(hostelA)
                .block(blockB)
                .room(roomB204)
                .category(catElec)
                .title("Ceiling Fan Regulator Sparking")
                .description("The ceiling fan speed regulator makes a sparking sound when turned to position 3.")
                .priority(PriorityLevel.HIGH)
                .status(ComplaintStatus.IN_PROGRESS)
                .assignedTo(maintUser1)
                .slaDeadline(LocalDateTime.now().plusHours(8))
                .isRecurring(false)
                .escalationLevel(0)
                .build());

        complaintCommentRepository.save(ComplaintComment.builder()
                .complaint(c1)
                .author(maintUser1)
                .comment("Carrying spare capacitor and regulator switch. Visiting room at 3:00 PM.")
                .isInternalStaffOnly(false)
                .build());

        Complaint c2 = complaintRepository.save(Complaint.builder()
                .complaintNumber("CMP-2026-0002")
                .student(student1)
                .hostel(hostelA)
                .block(blockB)
                .room(roomB204)
                .category(catPlumb)
                .title("Bathroom Tap Water Leakage")
                .description("Continuous dripping water from hot water tap in washroom.")
                .priority(PriorityLevel.MEDIUM)
                .status(ComplaintStatus.RESOLVED)
                .assignedTo(maintUser2)
                .resolvedAt(LocalDateTime.now().minusHours(2))
                .resolutionNotes("Replaced the internal brass spindle and washer.")
                .slaDeadline(LocalDateTime.now().plusHours(12))
                .isRecurring(false)
                .escalationLevel(0)
                .build());

        // 8. Seed Mess Menu (Weekly 7 Days)
        String[] days = {"MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"};
        for (String day : days) {
            DayOfWeekEnum d = DayOfWeekEnum.valueOf(day);
            foodMenuRepository.save(FoodMenu.builder().hostel(hostelA).dayOfWeek(d).mealType(MealType.BREAKFAST).menuTitle("South & North Indian Breakfast").items("Idli, Medu Vada, Sambar, Coconut Chutney, Poha, Boiled Eggs / Banana, Tea / Coffee").startTime(LocalTime.of(7, 30)).endTime(LocalTime.of(9, 30)).build());
            foodMenuRepository.save(FoodMenu.builder().hostel(hostelA).dayOfWeek(d).mealType(MealType.LUNCH).menuTitle("Executive Lunch Buffet").items("Steamed Basmati Rice, Chapati, Dal Tadka, Paneer Butter Masala / Chicken Gravy, Curd, Salad").startTime(LocalTime.of(12, 30)).endTime(LocalTime.of(14, 30)).build());
            foodMenuRepository.save(FoodMenu.builder().hostel(hostelA).dayOfWeek(d).mealType(MealType.SNACKS).menuTitle("Evening Refreshment").items("Samosa / Veg Cutlet, Masala Chai, Filter Coffee").startTime(LocalTime.of(17, 0)).endTime(LocalTime.of(18, 30)).build());
            foodMenuRepository.save(FoodMenu.builder().hostel(hostelA).dayOfWeek(d).mealType(MealType.DINNER).menuTitle("Nutritious Dinner Spread").items("Phulka, Jeera Rice, Dal Makhani, Mixed Vegetable Korma, Rasam, Sweet").startTime(LocalTime.of(19, 30)).endTime(LocalTime.of(21, 30)).build());
        }

        // 9. Seed "Keep My Food" Reservation
        foodReservationRepository.save(FoodReservation.builder()
                .student(student1)
                .hostel(hostelA)
                .mealDate(LocalDate.now())
                .mealType(MealType.DINNER)
                .expectedArrivalTime(LocalTime.of(21, 30))
                .reason("Attending AI Workshop at campus computing lab")
                .status(FoodReservationStatus.PACKED)
                .packingNotes("Box #14 labeled and placed in Hot-case Unit A")
                .build());

        // 10. Seed Leave Request
        leaveRequestRepository.save(LeaveRequest.builder()
                .student(student1)
                .leaveType(LeaveType.HOME)
                .startDate(LocalDate.now().plusDays(2))
                .endDate(LocalDate.now().plusDays(5))
                .reason("Visiting family for sister's engagement ceremony")
                .destinationAddress("14, Lake View Road, Bangalore")
                .travelMode("Train - Shatabdi Express")
                .parentConsentVerified(true)
                .status(LeaveStatus.APPROVED_WARDEN)
                .approvedBy(wardenUser1)
                .wardenRemarks("Approved. Contacted parent (+91 9443322199) and verified consent.")
                .build());

        // 11. Seed Late Entry
        lateEntryRepository.save(LateEntry.builder()
                .student(student2)
                .date(LocalDate.now())
                .expectedTime(LocalTime.of(22, 30))
                .reason("Hackathon Project Finals Preparation")
                .status(LateEntryStatus.DECLARED)
                .build());

        // 12. Seed Student Welfare / Health Case
        healthRecordRepository.save(HealthRecord.builder()
                .student(student1)
                .illnessType("Mild Viral Flu")
                .symptoms("Low-grade fever and throat irritation since morning")
                .reportedDate(LocalDate.now())
                .hospitalVisit(true)
                .hospitalName("Campus Health Center")
                .doctorNotes("Prescribed Paracetamol & Vitamin C. Advised 2 days room rest.")
                .status(HealthStatus.CURRENTLY_UNWELL)
                .nextFollowUpDate(LocalDate.now().plusDays(1))
                .build());

        // 13. Seed Ideas & Announcements
        suggestionRepository.save(Suggestion.builder()
                .student(student1)
                .category(SuggestionCategory.RECREATION)
                .title("Install 2 Table Tennis Tables in Block B Common Hall")
                .description("Adding indoor recreation equipment will help residents relax after intensive academic hours.")
                .upvotesCount(24)
                .status(SuggestionStatus.ACCEPTED)
                .adminFeedback("Approved by Hostel Student Council. Procurement in progress.")
                .build());

        announcementRepository.save(Announcement.builder()
                .hostel(hostelA)
                .author(wardenUser1)
                .title("Scheduled Solar Water Heater Maintenance (Tomorrow 9 AM - 12 PM)")
                .content("Dear Residents, routine solar heating coil maintenance is scheduled for Block A & B tomorrow morning. Hot water supply will resume by 12:30 PM.")
                .category(AnnouncementCategory.WATER_MAINTENANCE)
                .priority(AnnouncementPriority.IMPORTANT)
                .build());

        // 14. Seed Parcel with OTP
        parcelRepository.save(Parcel.builder()
                .student(student1)
                .courierName("Amazon Prime Logistics")
                .trackingNumber("AMZN-IN-9948214")
                .arrivalTimestamp(LocalDateTime.now().minusHours(2))
                .collectionOtp("492815")
                .status(ParcelStatus.ARRIVED)
                .remarks("Shelf Unit B, Gate 1 Security Counter")
                .build());

        // 15. Seed Payments & Fees (Paid, Pending, Overdue)
        seedPayments(hostelA, student1, student2, student3);

        log.info("Hostel360 seed data successfully generated with Girls Hostels, female residents, SLA tickets, and fee payment invoices.");
    }

    private void seedPaymentsIfEmpty() {
        if (paymentRepository.count() == 0) {
            List<Student> students = studentRepository.findAll();
            if (students.size() >= 2) {
                Hostel hostel = students.get(0).getHostel();
                seedPayments(hostel, students.get(0), students.get(1), students.size() > 2 ? students.get(2) : students.get(0));
            }
        }
    }

    private void seedPayments(Hostel hostel, Student s1, Student s2, Student s3) {
        paymentRepository.save(Payment.builder()
                .invoiceNumber("INV-2026-001")
                .student(s1)
                .hostel(hostel)
                .paymentType(PaymentType.HOSTEL_FEE)
                .amount(new BigDecimal("45000.00"))
                .paidAmount(new BigDecimal("45000.00"))
                .status(PaymentStatus.PAID)
                .paymentMethod(PaymentMethod.UPI)
                .transactionReference("UPI-HDFC-994827104")
                .dueDate(LocalDate.of(2026, 1, 15))
                .paymentDate(LocalDateTime.of(2026, 1, 10, 14, 30))
                .academicYear("2025-2026")
                .semester("Spring")
                .remarks("Hostel room accommodation fee (Spring 2026)")
                .receiptUrl("/receipts/INV-2026-001.pdf")
                .build());

        paymentRepository.save(Payment.builder()
                .invoiceNumber("INV-2026-002")
                .student(s1)
                .hostel(hostel)
                .paymentType(PaymentType.MESS_FEE)
                .amount(new BigDecimal("22500.00"))
                .paidAmount(new BigDecimal("22500.00"))
                .status(PaymentStatus.PAID)
                .paymentMethod(PaymentMethod.NET_BANKING)
                .transactionReference("NB-ICICI-882711094")
                .dueDate(LocalDate.of(2026, 2, 1))
                .paymentDate(LocalDateTime.of(2026, 1, 28, 10, 15))
                .academicYear("2025-2026")
                .semester("Spring")
                .remarks("Mess catering charges for Q1")
                .receiptUrl("/receipts/INV-2026-002.pdf")
                .build());

        paymentRepository.save(Payment.builder()
                .invoiceNumber("INV-2026-003")
                .student(s2)
                .hostel(hostel)
                .paymentType(PaymentType.HOSTEL_FEE)
                .amount(new BigDecimal("45000.00"))
                .paidAmount(BigDecimal.ZERO)
                .status(PaymentStatus.PENDING)
                .dueDate(LocalDate.now().plusDays(10))
                .academicYear("2025-2026")
                .semester("Spring")
                .remarks("Hostel accommodation fee (Installment 2)")
                .receiptUrl("/receipts/INV-2026-003.pdf")
                .build());

        paymentRepository.save(Payment.builder()
                .invoiceNumber("INV-2026-004")
                .student(s3)
                .hostel(hostel)
                .paymentType(PaymentType.MESS_FEE)
                .amount(new BigDecimal("18000.00"))
                .paidAmount(new BigDecimal("10000.00"))
                .status(PaymentStatus.PARTIALLY_PAID)
                .paymentMethod(PaymentMethod.UPI)
                .transactionReference("UPI-GPAY-7728103")
                .dueDate(LocalDate.now().minusDays(5))
                .paymentDate(LocalDateTime.now().minusDays(8))
                .academicYear("2025-2026")
                .semester("Spring")
                .remarks("Partial mess payment received. ₹8,000 balance pending.")
                .receiptUrl("/receipts/INV-2026-004.pdf")
                .build());

        paymentRepository.save(Payment.builder()
                .invoiceNumber("INV-2026-005")
                .student(s2)
                .hostel(hostel)
                .paymentType(PaymentType.MAINTENANCE_FEE)
                .amount(new BigDecimal("3500.00"))
                .paidAmount(BigDecimal.ZERO)
                .status(PaymentStatus.OVERDUE)
                .dueDate(LocalDate.now().minusDays(15))
                .academicYear("2025-2026")
                .semester("Spring")
                .remarks("Annual amenities & gym maintenance surcharge")
                .receiptUrl("/receipts/INV-2026-005.pdf")
                .build());
    }
}
