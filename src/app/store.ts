import { Vector3 } from "@react-three/fiber";
import { Mesh } from "three";
import { create } from "zustand";

interface Card {
  cardNumber: string | null,
  setCardNumber: (t: string | null) => void
};

export const CardStore = create<Card>((set) => ({
  cardNumber: null,
  setCardNumber: (t: string | null) => set({ cardNumber: t })
}))

interface Refs {
  refs: { [key: string]: Mesh | null };
  setRef: (key: string, mesh: Mesh | null) => void;
  setRefPosition: (key: string, position: Vector3) => void;
}

export const CardRefStore = create<Refs>((set) => ({
  refs: {},
  setRef: (key: string, mesh: Mesh | null) => set((state) => ({
    refs: { ...state.refs, [key]: mesh }
  })),
  setRefPosition: (key: string, position: Vector3) => set((state) => {
    const mesh = state.refs[key];
    if (mesh) {
      mesh.position.x = position[0 as keyof Vector3]
      mesh.position.y = position[1 as keyof Vector3]
      mesh.position.z = position[2 as keyof Vector3]
    }
    return ({
      refs: { ...state.refs, [key]: mesh }
    })
  })
}));
