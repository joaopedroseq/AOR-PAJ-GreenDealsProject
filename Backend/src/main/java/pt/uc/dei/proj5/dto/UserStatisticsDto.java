package pt.uc.dei.proj5.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

public class UserStatisticsDto {
    private int totalUsers;
    private Map<UserAccountState, Integer> usersByState;
    private Map<String, Integer> newUsersByPeriod;
    private Map<LocalDate, Integer> newUsersByDayOfYear;
    private double avgTimeToActivate;
    private double avgTimeToFirstPublish;


    public UserStatisticsDto() {
    }

    public int getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(int totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Map<UserAccountState, Integer> getUsersByState() {
        return usersByState;
    }

    public void setUsersByState(Map<UserAccountState, Integer> usersByState) {
        this.usersByState = usersByState;
    }

    public Map<String, Integer> getNewUsersByPeriod() {
        return newUsersByPeriod;
    }

    public void setNewUsersByPeriod(Map<String, Integer> newUsersByPeriod) {
        this.newUsersByPeriod = newUsersByPeriod;
    }

    public double getAvgTimeToFirstPublish() {
        return avgTimeToFirstPublish;
    }

    public void setAvgTimeToFirstPublish(double avgTimeToFirstPublish) {
        this.avgTimeToFirstPublish = avgTimeToFirstPublish;
    }

    public double getAvgTimeToActivate() {
        return avgTimeToActivate;
    }

    public void setAvgTimeToActivate(double avgTimeToActivate) {
        this.avgTimeToActivate = avgTimeToActivate;
    }

    public Map<LocalDate, Integer> getNewUsersByDayOfYear() {
        return newUsersByDayOfYear;
    }

    public void setNewUsersByDayOfYear(Map<LocalDate, Integer> newUsersByDayOfYear) {
        this.newUsersByDayOfYear = newUsersByDayOfYear;
    }
}
