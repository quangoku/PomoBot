import { EMessageComponentType, type InputComponent } from "mezon-sdk";

export function createInput(id: string, placeholder: string): InputComponent {
  const select: InputComponent = {
    type: EMessageComponentType.INPUT,
    id: id,
    component: {
      placeholder: placeholder,
    },
  };
  return select;
}
