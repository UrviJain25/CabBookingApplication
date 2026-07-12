package com.example.demo.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TripBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tripBookingId;

    private int customerId;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @ManyToOne
    @JoinColumn(name = "cab_id")
    private Cab cab;

    private String fromLocation;

    private String toLocation;

    private LocalDateTime fromDateTime;

    private LocalDateTime toDateTime;

    // true = ongoing/active booking, false = completed/cancelled
    private boolean status;

    private float distanceInKm;

    private float bill;
}