import styles from "../../styles/CustomTable.module.css";
import Th from "./th";
import Tr from "./tr";
import Td from "./td";
import Tbody from "./tBody";
import Thead from "./tHead";
import Table from "./table";

export default function CustomTable() {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th title="Company" />
          <Th title="Contact" />
          <Th title="Country" />
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td title="Alfreds Futterkiste" />
          <Td title="Maria Anders" />
          <Td title="Germany" />
        </Tr>
        <Tr>
          <Td title="Centro comercial Moctezumal" />
          <Td title="Francisco Chang" />
          <Td title="Mexico" />
        </Tr>
      </Tbody>
    </Table>
  );
}
