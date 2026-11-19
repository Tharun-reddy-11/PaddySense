package com.paddysense.dto;

public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String state;
    private String district;
    private String village;
    private String preferredUnit;

    public RegisterRequest() {}

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public String getPreferredUnit() { return preferredUnit; }
    public void setPreferredUnit(String preferredUnit) { this.preferredUnit = preferredUnit; }
}
