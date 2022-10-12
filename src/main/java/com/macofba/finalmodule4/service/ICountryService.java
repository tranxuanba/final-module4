package com.macofba.finalmodule4.service;

import com.macofba.finalmodule4.model.Country;

import java.util.Optional;

public interface ICountryService {
    Iterable<Country> findAllCountry();
    Optional<Country> findById(Long id);
    Country save(Country country);
    void remove(Long id);
}
