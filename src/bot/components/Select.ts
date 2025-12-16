import { EMessageComponentType, type SelectComponent } from "mezon-sdk";

interface Option {
  label: string;
  value: string;
}

export function createSelect(
  id: string,
  placeholder: string,
  options: Array<Option>
): SelectComponent {
  const select: SelectComponent = {
    type: EMessageComponentType.SELECT,
    id: id,
    component: {
      placeholder: placeholder,
      options: options,
    },
  };
  return select;
}
