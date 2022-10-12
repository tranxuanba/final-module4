package com.macofba.finalmodule4.service;

import com.macofba.finalmodule4.model.City;

import java.util.Optional;

public interface ICityService {
    Iterable<City> findAllCity();
    Optional<City> findById(Long id);
    City save(City city);
    void remove(Long id);
}
