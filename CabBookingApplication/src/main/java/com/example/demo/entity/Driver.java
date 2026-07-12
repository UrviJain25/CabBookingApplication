package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long driverId;

    private String driverName;

    @Column(unique = true)
    private String licenceNo;

    private String mobileNumber;

    private String email;

    private float rating;

    // A driver may or may not have a cab assigned yet
    @OneToOne
    @JoinColumn(name = "cab_id")
    private Cab cab;
}
