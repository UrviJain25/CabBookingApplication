package com.example.demo;

import com.example.demo.entity.Cab;
import com.example.demo.entity.Driver;
import com.example.demo.entity.User;
import com.example.demo.repository.CabRepository;
import com.example.demo.repository.DriverRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Component
	public static class DatabaseSeeder implements CommandLineRunner {

		@Autowired
		private UserRepository userRepository;

		@Autowired
		private CabRepository cabRepository;

		@Autowired
		private DriverRepository driverRepository;

		@Autowired
		private PasswordEncoder passwordEncoder;

		@Override
		public void run(String... args) throws Exception {
			// 1. Seed Admin User if not present
			if (userRepository.findByUsername("admin").isEmpty()) {
				User admin = new User();
				admin.setUsername("admin");
				admin.setPassword(passwordEncoder.encode("admin123"));
				admin.setRole("ADMIN");
				userRepository.save(admin);
				System.out.println("Seeded default Admin user: admin / admin123");
			}

			// 2. Seed cabs AND assign drivers to them if empty
			if (cabRepository.count() == 0) {
				Cab cab1 = new Cab();
				cab1.setCabNumber("KA-03-AB-2245");
				cab1.setCarModel("Toyota Prius (Economy)");
				cab1.setCabType("Economy");
				cab1.setCapacity(4);
				cab1.setAvailable(true);
				cab1 = cabRepository.save(cab1);

				Cab cab2 = new Cab();
				cab2.setCabNumber("KA-05-JD-2270");
				cab2.setCarModel("Honda Civic (Premium)");
				cab2.setCabType("Premium");
				cab2.setCapacity(4);
				cab2.setAvailable(true);
				cab2 = cabRepository.save(cab2);

				Cab cab3 = new Cab();
				cab3.setCabNumber("KA-04-XY-9999");
				cab3.setCarModel("Toyota Innova (SUV)");
				cab3.setCabType("SUV");
				cab3.setCapacity(6);
				cab3.setAvailable(true);
				cab3 = cabRepository.save(cab3);

				System.out.println("Seeded 3 available cabs.");

				// Seed drivers and assign them directly to the cabs
				Driver d1 = new Driver();
				d1.setDriverName("Rahul Verma");
				d1.setLicenceNo("DL-14-2018009");
				d1.setMobileNumber("9876543210");
				d1.setEmail("rahul@flexiride.com");
				d1.setRating(4.8f);
				d1.setCab(cab1);
				driverRepository.save(d1);

				Driver d2 = new Driver();
				d2.setDriverName("Sanjay Iyer");
				d2.setLicenceNo("MH-12-2015099");
				d2.setMobileNumber("9812345678");
				d2.setEmail("sanjay@flexiride.com");
				d2.setRating(4.9f);
				d2.setCab(cab2);
				driverRepository.save(d2);

				Driver d3 = new Driver();
				d3.setDriverName("Amit Sharma");
				d3.setLicenceNo("KA-09-2019033");
				d3.setMobileNumber("9900112233");
				d3.setEmail("amit@flexiride.com");
				d3.setRating(4.7f);
				d3.setCab(cab3);
				driverRepository.save(d3);

				System.out.println("Seeded 3 drivers and assigned them to cabs.");
			}
		}
	}
}
