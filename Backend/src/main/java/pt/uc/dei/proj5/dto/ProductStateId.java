package pt.uc.dei.proj5.dto;

public enum ProductStateId {
    AVAILABLE,
    RESERVED,
    BOUGHT,
    DRAFT;

    public ProductStateId stateIdFromInt(int stateId) {
        switch (stateId) {
            case 1: return AVAILABLE;
            case 2: return RESERVED;
            case 3: return BOUGHT;
            case 4: return DRAFT;
        }
        return null;
    }

    static public int intFromStateId(ProductStateId productStateId) {
        switch (productStateId) {
            case AVAILABLE: return 1;
            case RESERVED: return 2;
            case BOUGHT: return 3;
            case DRAFT: return 4;
        }
        return -1;
    }

    public static boolean checkIfValidStateId(String stateIdString) {
        stateIdString = stateIdString.trim();
        if (stateIdString.isEmpty()) {
            return false;
        }
        else if (stateIdString.length() > 9) {
            return false;
        } else {
            for (int i = 0; i < stateIdString.length(); i++) {
                if (!Character.isDigit(stateIdString.charAt(i))) {
                    return false;
                }
            }
        }
        int stateId = Integer.parseInt(stateIdString);
        if(stateId < 1 || stateId > 4) {
            return false;
        }
        return true;
    }
}