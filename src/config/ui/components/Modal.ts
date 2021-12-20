const Modal = {
  baseStyle: {
    dialogContainer: {
      py: '20px',
      px: '40px',
    },
    header: { // this css is used the alert dialog opened when the user clicks to delete the photo
      d: 'flex',
      alignContent: 'center',
      justifyContent: 'space-between',
      ['& > button']: {
        position: 'initial',
      },
    },
    dialog: {
      m: '0px',
      overflow: 'hidden',
    },
    body: {
      p: '0px',
    },
  },
}

export { Modal }
