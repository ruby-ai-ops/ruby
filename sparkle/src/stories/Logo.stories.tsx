import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { Div3D, Hover3D } from "..";
import {
  RubyLogo,
  RubyLogoGray,
  RubyLogoLayer1,
  RubyLogoLayer2,
  RubyLogoSquare,
  RubyLogoSquareGray,
  RubyLogoSquareLayer1,
  RubyLogoSquareLayer2,
  RubyLogoSquareWhite,
  RubyLogoWhite,
} from "../logo/ruby";

const meta = {
  title: "Assets/Logo",
  tags: ["!manifest", "autodocs"],
  parameters: {
    docs: {
      description: {
        component: `The approved Ruby portrait assets (\`@sparkle/logo/ruby\`). Legacy horizontal, square, white, gray, and mono export names remain for API compatibility and all render the same full-color mark. Layer pairs split the portrait into complementary halves for existing 3D/parallax treatments. Import these assets rather than recreating or recoloring the mark.`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: "48px 16px",
};
const itemStyle: React.CSSProperties = {
  marginTop: "12px",
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textAlign: "left",
  width: "100%",
};

/** @summary Approved Ruby portrait across compatibility variants and layers. */
export const RubyLogos: Story = {
  render: () => (
    <>
      <div style={gridStyle}>
        <div className="p-6">
          <RubyLogo className="h-8 w-32" />
          <div style={itemStyle} className="text-sm">
            RubyLogo
          </div>
        </div>
        <div className="p-6">
          <RubyLogoGray className="h-8 w-32" />
          <div style={itemStyle} className="text-sm">
            RubyLogoGray
          </div>
        </div>
        <div className="bg-primary-800 p-6">
          <RubyLogoWhite className="h-8 w-32" />
          <div style={itemStyle} className="text-sm text-white">
            RubyLogoWhite
          </div>
        </div>
      </div>

      <div style={gridStyle}>
        <div className="p-6">
          <RubyLogoSquare className="h-16 w-16" />
          <div style={itemStyle} className="text-sm">
            RubyLogoSquare
          </div>
        </div>
        <div className="p-6">
          <RubyLogoSquareGray className="h-16 w-16" />
          <div style={itemStyle} className="text-sm">
            RubyLogoSquareGray
          </div>
        </div>
        <div className="bg-primary-800 p-6">
          <RubyLogoSquareWhite className="h-16 w-16" />
          <div style={itemStyle} className="text-sm text-white">
            RubyLogoSquareWhite
          </div>
        </div>
      </div>

      <div style={gridStyle}>
        <div className="p-6">
          <Hover3D className="relative h-8 w-32">
            <Div3D depth={0} className="h-8 w-32">
              <RubyLogoLayer1 className="h-8 w-32" />
            </Div3D>
            <Div3D depth={25} className="absolute top-0">
              <RubyLogoLayer2 className="h-8 w-32" />
            </Div3D>
          </Hover3D>
          <div style={itemStyle} className="text-sm">
            Horizontal Hover3D
          </div>
        </div>
        <div className="p-6">
          <Hover3D className="relative h-16 w-16">
            <Div3D depth={0} className="h-16 w-16">
              <RubyLogoSquareLayer1 className="h-16 w-16" />
            </Div3D>
            <Div3D depth={25} className="absolute top-0">
              <RubyLogoSquareLayer2 className="h-16 w-16" />
            </Div3D>
          </Hover3D>
          <div style={itemStyle} className="text-sm">
            Square Hover3D
          </div>
        </div>
      </div>
    </>
  ),
};
