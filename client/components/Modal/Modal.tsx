import { Backdrop } from "../Backdrop";
import { motion } from "framer-motion";
import styles from "./modal.module.css";

import { CustomButton } from "../../components";

import { useRouter } from "next/router";

import { useStateContext } from "../../context";

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 50,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

interface ModalProps {
  text: string;
  handleClose: () => void;
}


const Modal = ({ text, handleClose }: ModalProps) => {

  const { createCrapsGame } = useStateContext();

  const router = useRouter();

  const handleWithdraw = () => {
    console.log("withdraw");
  };
  
  const _createCrapsGame = () => {
    console.log("create craps game");
    createCrapsGame();
    router.push("/");
  };
  
  const createBaccaratGame = () => {
    console.log("create baccarat game");

    router.push("/CreateBaccaratGame");
  };

  return (
    <div className="flex justify-center items-center">
      <Backdrop onClink={handleClose}>
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className={styles.modal}
          variants={dropIn}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="m-5 space-y-5">
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Which game you want to Create?
            </h4>
            <div className="flex justify-between">
              <CustomButton
                btnType="button"
                title="Craps"
                styles="w-fit bg-[#E00000]"
                handleClick={_createCrapsGame}
              />
              <CustomButton
                btnType="button"
                title="Bacarrat"
                styles="w-fit bg-[#E00000]"
                handleClick={createBaccaratGame}
              />

              <CustomButton
                btnType="button"
                title="NFT"
                styles="w-fit bg-[#E00000]"
                handleClick={handleWithdraw}
              />
            </div>
          </div>
        </motion.div>
      </Backdrop>
    </div>
  );
};

export default Modal;
