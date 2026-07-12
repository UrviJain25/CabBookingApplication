package com.example.demo.serviceimpl;


import java.util.List;
import java.util.ArrayList;


import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



import com.example.demo.dto.BookingDto;
import com.example.demo.dto.TripBookingResponseDto;
import com.example.demo.entity.Cab;
import com.example.demo.entity.Driver;
import com.example.demo.entity.TripBooking;
import com.example.demo.repository.CabRepository;
import com.example.demo.repository.DriverRepository;
import com.example.demo.repository.TripBookingRepository;
import com.example.demo.service.TripBookingService;

@Service
public class TripBookingServiceImpl implements TripBookingService {

    @Autowired
    private TripBookingRepository tripBookingRepository;

    @Autowired
    private CabRepository cabRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Override
    public TripBookingResponseDto bookCab(BookingDto dto) {
        Cab cab = cabRepository.findById(dto.getCabId())
                .orElseThrow(() -> new RuntimeException("Cab not found with id: " + dto.getCabId()));

        if (!cab.isAvailable()) {
            throw new RuntimeException("Cab is not available for booking");
        }

        // A cab must have a driver assigned (via US-011) before it can be booked
        Driver driver = driverRepository.findByCab_CabId(cab.getCabId())
                .orElseThrow(() -> new RuntimeException("No driver assigned to this cab yet"));

        TripBooking trip = new TripBooking();
        trip.setCustomerId(dto.getCustomerId());
        trip.setCab(cab);
        trip.setDriver(driver);
        trip.setFromLocation(dto.getFromLocation());
        trip.setToLocation(dto.getToLocation());
        trip.setFromDateTime(LocalDateTime.now());
        trip.setStatus(true); // booking created / trip active
        trip.setDistanceInKm(0f);
        trip.setBill(0f);

        TripBooking savedTrip = tripBookingRepository.save(trip);

        // Cab is now on a trip, so it's no longer available for other bookings
        cab.setAvailable(false);
        cabRepository.save(cab);

        return mapToResponseDto(savedTrip);
    }
    
    @Override
    public TripBookingResponseDto cancelBooking(Long bookingId) {
    	TripBooking booking = tripBookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));
    	if (!booking.isStatus()) {
    	    throw new RuntimeException("Booking is already cancelled.");
    	}
    	
    	booking.setStatus(false);
    	booking.setToDateTime(LocalDateTime.now());
    	
    	Cab cab = booking.getCab();
    	cab.setAvailable(true);
    	cabRepository.save(cab);
    	
    	TripBooking updatedBooking = tripBookingRepository.save(booking);

    	return mapToResponseDto(updatedBooking);

    }

    @Override
    public List<TripBookingResponseDto> getBookingHistory(int customerId) {

        List<TripBooking> bookings = tripBookingRepository.findByCustomerId(customerId);

        List<TripBookingResponseDto> bookingHistory = new ArrayList<>();

        for (TripBooking booking : bookings) {
            bookingHistory.add(mapToResponseDto(booking));
        }

        return bookingHistory;
    }
    
    @Override
    public TripBookingResponseDto getBookingStatus(Long bookingId) {

        TripBooking booking = tripBookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found with id: " + bookingId));

        return mapToResponseDto(booking);
    }
    
    @Override
    public List<TripBookingResponseDto> getAllBookings() {

        List<TripBooking> bookings = tripBookingRepository.findAll();

        List<TripBookingResponseDto> bookingList = new ArrayList<>();

        for (TripBooking booking : bookings) {
            bookingList.add(mapToResponseDto(booking));
        }

        return bookingList;
    }

    private TripBookingResponseDto mapToResponseDto(TripBooking trip) {
        TripBookingResponseDto dto = new TripBookingResponseDto();
        dto.setTripBookingId(trip.getTripBookingId());
        dto.setCustomerId(trip.getCustomerId());
        dto.setFromLocation(trip.getFromLocation());
        dto.setToLocation(trip.getToLocation());
        dto.setFromDateTime(trip.getFromDateTime());
        dto.setToDateTime(trip.getToDateTime());
        dto.setStatus(trip.isStatus());
        dto.setDistanceInKm(trip.getDistanceInKm());
        dto.setBill(trip.getBill());

        if (trip.getCab() != null) {
            dto.setCabId(trip.getCab().getCabId());
            dto.setCabNumber(trip.getCab().getCabNumber());
        }
        if (trip.getDriver() != null) {
            dto.setDriverId(trip.getDriver().getDriverId());
            dto.setDriverName(trip.getDriver().getDriverName());
        }
        return dto;
    }
}