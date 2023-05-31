import * as React from "react";

function Icon(props) {
  return (
    <svg
      width={254}
      height={300}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#prefix__clip0_524_11)">
        <path
          d="M127.141 0l-26.945 44.816 97.27 166.693L118.555 300s62.025-.368 61.657 0c-.368.368 73.776-83.347 73.776-83.347L127.141 0zM91.758 61.344L0 217.39 72.304 300h27.193l39.755-46.27H95.08l-38.945-43.316 62.393-106.113-26.77-42.957z"
          fill={props.fill}
        />
      </g>
      <defs>
        <clipPath id="prefix__clip0_524_11">
          <path fill="#fff" d="M0 0h253.988v300H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default Icon;