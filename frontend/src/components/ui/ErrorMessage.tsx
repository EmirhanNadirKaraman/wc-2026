interface Props {
  message?: string;
}

export const ErrorMessage = ({ message = "Bir hata oluştu." }: Props) => (
  <div className="error-message">{message}</div>
);
