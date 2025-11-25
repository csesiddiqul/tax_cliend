// import node module libraries
import { Row, Container } from "react-bootstrap";

// import sub components
import {
  AboutMe,
  ProfileHeader
} from "sub-components";

const Profile = () => {
  return (
    <Container fluid className="p-6">
      {/* <PageHeading heading="Overview" /> */}

      <ProfileHeader />

      <div className="py-6">
        <Row>
          <AboutMe />

        </Row>
      </div>
    </Container>
  );
};

export default Profile;
