// import node module libraries
import { Col, Row, Card, Table, Nav, Tab, Container } from "react-bootstrap";

// import widget/custom components
import { HighlightCode } from "widgets";

// import react code data file
import {
  BasicTableCode,
} from "data/code/TablesCode";

const OtherAccountTables = () => {
  return (
    <Container fluid className="p-6">

      <Row>
        <Col xl={12} lg={12} md={12} sm={12} className="mb-4">
          <div id="examples" className="mb-4">
            <h2>Other Account Tables</h2>
          </div>
          <Tab.Container id="tab-container-1" defaultActiveKey="design">
            <Card>

              <Card.Body className="p-0">
                <Tab.Content>
                  <Tab.Pane eventKey="design" className="pb-4 p-4">
                    {/* code started */}
                    <Table className="text-nowrap">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">HoldingNo</th>
                          <th scope="col">ClientNo</th>
                          <th scope="col">OwnersName</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td>0223-00</td>
                          <td>01-044-0223-00</td>
                          <td>ঝর্না</td>
                          <td>View</td>
                        </tr>
                        <tr>
                          <th scope="row">1</th>
                          <td>0223-00</td>
                          <td>01-044-0223-20</td>
                          <td>মোল্যা</td>
                          <td>View</td>
                        </tr>
                        <tr>
                          <th scope="row">1</th>
                          <td>0223-00</td>
                          <td>01-044-0223-21</td>
                          <td> র্ইরাহিম </td>
                          <td>View</td>
                        </tr>

                      </tbody>
                    </Table>
                    {/* end of code */}
                  </Tab.Pane>
                  <Tab.Pane eventKey="react" className="pb-4 p-4 react-code">
                    <HighlightCode code={BasicTableCode} />
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Tab.Container>
        </Col>
      </Row>
      {/* end of  */}
      {/* end of responsive-tables */}
    </Container>
  );
};

export default OtherAccountTables;
