import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  width: 700px;
  max-width: 90%;
  margin: 0 auto;
`;

export const Title = styled.h1`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    max-width: 50%;
    text-align: center;
    font-size: 3rem;

`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

export const TableHead = styled.thead`
  background-color: #f1f1f1;
`;

export const TableHeader = styled.th`
  padding: 10px;
  text-align: left;
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

export const TableCell = styled.td`
  padding: 10px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

export const FormLabel = styled.label`
  font-size: 18px;
  margin-bottom: 10px;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  margin-bottom: 20px;
`;

export const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
`;

export const Image = styled.img`
  max-width: 100%;
  height: auto;
`;

export const ImageName = styled.h3`
  margin: 10px 0 0;
  font-size: 1.2rem;
  text-align: center;

`;

export const ImageWithText = ({src, alt, name}) => {
    return(
        <div>
        <Image src ={src} alt={alt} />
        <ImageName>{name}</ImageName>
        </div>
    );
};

export const TimerContainer = styled.h2`
    margin: 10px 0 0;
    font-size: 2rem;
    text-align: center;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

export const Button = styled.button`
  background-color: ${(props) => (props.color === 'yes' ? '#3cb371' : '#e74c3c')};
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  margin: 0 10px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) => (props.color === 'yes' ? '#2b9e2c' : '#c0392b')};
  }
`;

export const FinalScore = styled.h1`
  margin: 10px 0 0;
  font-size: 2.5rem;
  text-align: center;
`;
