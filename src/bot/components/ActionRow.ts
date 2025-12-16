import type {
  ButtonComponent,
  IMessageActionRow,
  InputComponent,
  SelectComponent,
} from "mezon-sdk";

export function createActionRow(
  components: Array<ButtonComponent | SelectComponent | InputComponent>
) {
  const actionRow: IMessageActionRow = {
    components: components,
  };
  return actionRow;
}
