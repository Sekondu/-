import { useContext,useReducer,createContext } from "react";


export const PillContext = createContext(null) || {state : [] , dispatch : () => {}} ;

function Pillreducer(state, action){

    switch(action.type){

        case 'add_medecine':
            return [...state, action.payload];

        case 'remove_medecine':
            return state.filter( medecine => medecine.id !== action.payload.id);

        case 'update_medecine':
            return [...state.filter(medecine => medecine.id !== action.payload.id) , action.payload];

        default:
            return state;
    }

}

export function PillProvider({ children }){
    const [state , dispatch] = useReducer(Pillreducer , []);

    return <PillContext.Provider value = {{ state , dispatch }} >
        {children}
    </PillContext.Provider>
}