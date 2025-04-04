package pt.uc.dei.proj5.dto;

import java.util.ArrayList;

public class EvaluationCounts {
    private int oneStar;
    private int twoStar;
    private int threeStar;
    private int fourStar;
    private int fiveStar;

    public EvaluationCounts() {
        oneStar = 0;
        twoStar = 0;
        threeStar = 0;
        fourStar = 0;
        fiveStar = 0;
    }

    public EvaluationCounts(int oneStar, int twoStar, int threeStar, int fourStar, int fiveStar) {
        this.oneStar = oneStar;
        this.twoStar = twoStar;
        this.threeStar = threeStar;
        this.fourStar = fourStar;
        this.fiveStar = fiveStar;
    }

    public EvaluationCounts(ArrayList<Evaluation> evaluations) {
        int oneStar = 0;
        int twoStars = 0;
        int threeStars = 0;
        int fourStars = 0;
        int fiveStars = 0;
        if (!evaluations.isEmpty()) {
            for (Evaluation evaluation : evaluations) {
                if (evaluation.getStarNumber() == 1) {
                    oneStar++;
                }
                if (evaluation.getStarNumber() == 2) {
                    twoStars++;
                }
                if (evaluation.getStarNumber() == 3) {
                    threeStars++;
                }
                if (evaluation.getStarNumber() == 4) {
                    fourStars++;
                }
                if (evaluation.getStarNumber() == 5) {
                    fiveStars++;
                }
            }

            this.oneStar = oneStar;
            this.twoStar = twoStars;
            this.threeStar = threeStars;
            this.fourStar = fourStars;
            this.fiveStar = fiveStars;
        } else {
            this.oneStar = 0;
            this.twoStar = 0;
            this.threeStar = 0;
            this.fourStar = 0;
            this.fiveStar = 0;
        }
    }

    public void setStarsAfterAdd(ArrayList<Evaluation> evaluations) {

        int oneStar = 0;
        int twoStars = 0;
        int threeStars = 0;
        int fourStars = 0;
        int fiveStars = 0;

        for (Evaluation evaluation : evaluations) {
            if (evaluation.getStarNumber() == 1) {
                oneStar++;
            }
            if (evaluation.getStarNumber() == 2) {
                twoStars++;
            }
            if (evaluation.getStarNumber() == 3) {
                threeStars++;
            }
            if (evaluation.getStarNumber() == 4) {
                fourStars++;
            }
            if (evaluation.getStarNumber() == 5) {
                fiveStars++;
            }
        }

        this.oneStar = oneStar;
        this.twoStar = twoStars;
        this.threeStar = threeStars;
        this.fourStar = fourStars;
        this.fiveStar = fiveStars;

    }

    public int getOneStar() {
        return oneStar;
    }

    public void setOneStar(int oneStar) {
        this.oneStar = oneStar;
    }

    public int getTwoStar() {
        return twoStar;
    }

    public void setTwoStar(int twoStar) {
        this.twoStar = twoStar;
    }

    public int getThreeStar() {
        return threeStar;
    }

    public void setThreeStar(int threeStar) {
        this.threeStar = threeStar;
    }

    public int getFourStar() {
        return fourStar;
    }

    public void setFourStar(int fourStar) {
        this.fourStar = fourStar;
    }

    public int getFiveStar() {
        return fiveStar;
    }

    public void setFiveStar(int fiveStar) {
        this.fiveStar = fiveStar;
    }
}
