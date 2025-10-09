// import node module libraries
import { Container } from "react-bootstrap";

// import widget as custom components
import { PageHeading } from "widgets";

// import sub components
import Addinfo from "sub-components/add-info/Addinfo";

const Addinfos = () => {
  return (
    <Container fluid className="p-6 ">
      <PageHeading heading="General" />
     
      <Addinfo />
    </Container>
  );
};

export default Addinfos;
