/*
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";

// Material Kit 2 React examples
import RotatingCard from "examples/Cards/RotatingCard";
import RotatingCardFront from "examples/Cards/RotatingCard/RotatingCardFront";
import RotatingCardBack from "examples/Cards/RotatingCard/RotatingCardBack";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

// Images
import bgFront from "assets/images/logo.gif";
import bgBack from "assets/images/rotating-card-bg-back.jpeg";

function Information() {
  return (
    <MKBox component="section" py={6} my={6}>
      <Container>
        <Grid container item xs={11} spacing={3} alignItems="center" sx={{ mx: "auto" }}>
          <Grid item xs={12} lg={4} sx={{ mx: "auto" }}>
            <RotatingCard >
              <RotatingCardFront
                image={bgFront}
                icon="touch_app"
                title={
                  <>

                    <br />

                  </>
                }

              />
              <RotatingCardBack
                image={bgBack}
                title="DILIGENCE TECHNOLOGIES"
                description="DETERMINED TO MAKE A DIFFERENCE!"
              />
            </RotatingCard>
          </Grid>
          <Grid item xs={12} lg={7} sx={{ ml: "auto" }} >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  icon="content_copy"
                  title="Data Center"
                  description="Explore our full range of IT infrastructure services, specializing in data center solutions. From consultancy to project management, we guide you in building and operating a secure, efficient data center customized to your needs. Our services cover equipment installation, power solutions, cooling systems, security measures, and more. "
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  icon="flip_to_front"
                  title="Managed Service"
                  description="Gain access to international partner help desks, call centers, and expertise covering network, data center, server infrastructure, storage, database, messaging, middleware, security, desktop, applications, NOC operations, and telecom. We provide end-to-end management to meet all your IT needs efficiently."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  icon="devices"
                  title="Telecom"
                  description="Discover our comprehensive telecom infrastructure services, tailored to meet all communication needs. From TSSR and driver tests to field operations, fiber optic cabling, and network installation, we provide a full suite of services. Our commitment to excellence extends to tower maintenance, installation, antenna installation, lighting, foundations, site grounding, electrical services, and custom tower design and fabrication."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  icon="flip_to_front"
                  title="Software Service"
                  description="Discover our comprehensive telecom infrastructure services, tailored to meet all communication needs. From TSSR and driver tests to field operations, fiber optic cabling, and network installation, we provide a full suite of services. Our commitment to excellence extends to tower maintenance, installation, antenna installation, lighting, foundations, site grounding, electrical services, and custom tower design and fabrication."
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mt: { xs: 0, md: 6 } }}>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  icon="price_change"
                  title="IT Consulting"
                  description="Navigate your IT challenges effortlessly with our expert consulting services. From information security and SAP consulting to architecture and process optimization, we provide practical solutions and expert guidance. Trust us to streamline your policies, infrastructure, and applications, ensuring optimal performance and success."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  icon="devices"
                  title="Mobility"
                  description="Stay ahead in the digital era with our mobility services. From iOS and Android app development to mobile web design and testing, we offer tailored solutions to keep your business seamlessly connected in today’s fast-paced digital landscape."
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Information;
