import React from "react";
import { ThreeDots } from "react-loader-spinner";

export const Spinner = ({
  getAllBooksLoading,
}: {
  getAllBooksLoading: boolean;
}) => {
  return (
    <div className="spinner">
      <ThreeDots
        height="150"
        width="150"
        radius="10"
        color="#2e7c31"
        ariaLabel="three-dots-loading"
        visible={getAllBooksLoading}
      />
    </div>
  );
};
