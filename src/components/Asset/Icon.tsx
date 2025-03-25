import React from "react";
import { ICONS } from "@/constants/asset";
import { ReactSVG } from "react-svg";

const colorMap = {
  green: "#2bc466",
  red: "#f5506c",
  gray: "#adafbb",
  gray40: "#caccd8",
  cardLikeStroke: "#FFF9F9",
};

export interface IconComponentProps {
  name: keyof typeof ICONS;
  color?: keyof typeof colorMap; // fill
  strokeColor?: keyof typeof colorMap; // stroke
  size?: number;
  padding?: number;
  isBtn?: boolean;
}

export default function IconComponent({
  name,
  color,
  strokeColor,
  size = 24,
  padding,
  isBtn = false,
}: IconComponentProps) {
  const iconSrc = ICONS[name];
  const selectedColor = color ? colorMap[color] : undefined;
  const selectedStrokeColor = strokeColor ? colorMap[strokeColor] : undefined;

  // size가 3 이하일 경우 padding-bottom 추가
  const additionalPadding = size <= 3 ? "10px" : padding;

  if (!iconSrc) {
    console.warn(`Icon "${name}" not found in ICONS`);
    return null;
  }

  if (typeof iconSrc === "string") {
    return (
      <div
        style={{
          padding: padding,
          paddingBottom: additionalPadding,
          cursor: isBtn ? "pointer" : "default",
        }}
      >
        <ReactSVG
          src={iconSrc}
          beforeInjection={(svg) => {
            svg.setAttribute("width", `${size}`);
            svg.setAttribute("height", `${size}`);

            if (selectedColor) {
              svg.setAttribute("fill", selectedColor);
              svg.querySelectorAll("path").forEach((el) => {
                el.setAttribute("fill", selectedColor);
              });
            }

            if (selectedStrokeColor) {
              svg.setAttribute("stroke", selectedStrokeColor);
              svg.querySelectorAll("path").forEach((el) => {
                el.setAttribute("stroke", selectedStrokeColor);
              });
            }
          }}
          style={{ display: "inline-block" }}
        />
      </div>
    );
  }

  return null;
}
