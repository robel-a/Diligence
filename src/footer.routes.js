// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

// Material Kit 2 React components
import MKTypography from "components/MKTypography";

// Images
import logoCT from "assets/images/logo-ct-dark.png";

const date = new Date().getFullYear();

export default {
  brand: {
    name: "Diligence Technology",
    image: logoCT,
    route: "/",
  },
  socials: [
    {
      icon: <FacebookIcon />,
      // link: "https://www.facebook.com/CreativeTim/",
    },
    {
      icon: <TwitterIcon />,
      // link: "https://twitter.com/creativetim",
    },
    {
      icon: <LinkedInIcon />,
      // link: "https://www.youtube.com/channel/UCVyTG4sCw-rOvB9oHkzZD1w",
    },
    {
      icon: <WhatsAppIcon />,
      // link: "https://www.youtube.com/channel/UCVyTG4sCw-rOvB9oHkzZD1w",
    },
  ],
  menus: [

    {
      name: "Address",
      items: [
        { name: "Aster Suraphel Building, In-front of Dreamliner Hotel, 3rd Floor, Addis Ababa, Ethiopia", href: "https://maps.google.com/maps?ll=8.994789,38.766572&z=10&t=m&hl=en-US&gl=US&mapclient=embed&cid=5650858108643827599" },

      ],
    },
  ],
  copyright: (
    <MKTypography variant="button" fontWeight="regular">
      All rights reserved. Copyright &copy; {date}{" "}
      <MKTypography
        component="a"
        href="https://www.creative-tim.com"
        target="_blank"
        rel="noreferrer"
        variant="button"
        fontWeight="regular"
      >

      </MKTypography>
      .
    </MKTypography>
  ),
};
