package pt.uc.dei.proj5.dto;

public enum ProductStateId {
    DISPONIVEL,
    RESERVADO,
    COMPRADO,
    RASCUNHO;

    public ProductStateId stateIdFromInt(int stateId) {
        switch (stateId) {
            case 1: return DISPONIVEL;
            case 2: return RESERVADO;
            case 3: return COMPRADO;
            case 4: return RASCUNHO;
        }
        return null;
    }

    static public int intFromStateId(ProductStateId productStateId) {
        switch (productStateId) {
            case DISPONIVEL: return 1;
            case RESERVADO: return 2;
            case COMPRADO: return 3;
            case RASCUNHO: return 4;
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