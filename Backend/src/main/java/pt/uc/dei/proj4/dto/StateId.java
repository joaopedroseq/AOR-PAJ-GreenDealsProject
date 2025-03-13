package pt.uc.dei.proj4.dto;

public enum StateId {
    RASCUNHO,
    DISPONIVEL,
    RESERVADO,
    COMPRADO;

    public StateId stateIdFromInt(int stateId) {
        switch (stateId) {
            case 2: return DISPONIVEL;
            case 3: return RESERVADO;
            case 4: return COMPRADO;
            default: return RASCUNHO;
        }
    }

    public int intFromStateId(StateId stateId) {
        switch (stateId) {
            case DISPONIVEL: return 2;
            case RESERVADO: return 3;
            case COMPRADO: return 4;
            default: return 1;
        }
    }
}
