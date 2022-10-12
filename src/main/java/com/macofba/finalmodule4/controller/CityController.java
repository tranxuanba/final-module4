package com.macofba.finalmodule4.controller;

import com.macofba.finalmodule4.model.City;
import com.macofba.finalmodule4.model.Country;
import com.macofba.finalmodule4.repository.ICityRepository;
import com.macofba.finalmodule4.service.ICityService;
import com.macofba.finalmodule4.service.ICountryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/citys")
@CrossOrigin("*")
public class CityController {
    @Autowired
    private ICityService cityService;
    @Autowired
    private ICountryService countryService;
    @GetMapping
    public ResponseEntity<?> showCity(){
        Iterable<City> citys = cityService.findAllCity();
        if (!citys.iterator().hasNext()){
            return new ResponseEntity<>("chua co thanh pho", HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(citys, HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<?> createCity(@RequestBody City city){
        return new ResponseEntity<>(cityService.save(city), HttpStatus.CREATED);
    }
    @PutMapping("{id}")
    public ResponseEntity<?> updateCity(@RequestBody City city, @PathVariable("id") Long id){
        Optional<City> cityOptional = cityService.findById(id);
        if (!cityOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        city.setId(cityOptional.get().getId());
        return new ResponseEntity<>(cityService.save(city), HttpStatus.OK);
    }
    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteCity(@PathVariable("id") Long id) {
        Optional<City> cityOptional = cityService.findById(id);
        if (!cityOptional.isPresent()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        cityService.remove(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        Optional<City> cityOptional = cityService.findById(id);
        return cityOptional.map(city -> new ResponseEntity<>(city, HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    @GetMapping("/countries")
    public ResponseEntity<?> showCountries() {
        Iterable<Country> countries = countryService.findAllCountry();
        if (!countries.iterator().hasNext()){
            return new ResponseEntity<>("chua co nuoc nao",HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(countries,HttpStatus.OK);
    }
}
