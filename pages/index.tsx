import {
  useCallback,
  MouseEvent,
  useState,
  useEffect,
  ChangeEvent,
} from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import {
  Container,
  Button,
  Grid,
  Card,
  Row,
  Text,
  Switch,
  SwitchEvent,
  Modal,
  Input,
  FormElement,
} from "@nextui-org/react";
import {
  CircularInput,
  CircularTrack,
  CircularProgress,
  CircularThumb,
} from "react-circular-input";

import Humidity from "assets/humidity.png";
import Temperature from "assets/temperature.png";
import TimeInterval from "assets/time-interval.png";
import WateringCan from "assets/watering-can.png";

import styles from "styles/Home.module.css";

interface CurrentData {
  temperature: string;
  humidity: string;
  mins: string;
}

const Home: NextPage = () => {
  const [isHumidityModalOpen, setIsHumidityModalOpen] = useState(false);
  const [isTemperatureModalOpen, setIsTemperatureModalOpen] = useState(false);
  const [isTimeIntervalModalOpen, setIsTimeIntervalModalOpen] = useState(false);

  const [currentData, setCurrentData] = useState<CurrentData>();

  const [humidity, setHumidity] = useState(0);
  const [temperature, setTemperature] = useState(0);

  const [timeInterval, setTimeInterval] = useState<string>();

  const onHumidityCheckChange = useCallback((event: SwitchEvent) => {
    fetch("http://localhost:8080/toggle-humidity", {
      method: "POST",
      body: JSON.stringify({
        toggle: event.target.checked,
      }),
      headers: {
        ["Content-Type"]: "application/json",
      },
    })
      .then((response) => response.json())
      .then(console.log)
      .catch(console.error);
  }, []);

  const onTemperatureCheckChange = useCallback((event: SwitchEvent) => {
    fetch("http://localhost:8080/toggle-temperature", {
      method: "POST",
      body: JSON.stringify({
        toggle: event.target.checked,
      }),
      headers: {
        ["Content-Type"]: "application/json",
      },
    })
      .then((response) => response.json())
      .then(console.log)
      .catch(console.error);
  }, []);

  const onSwitchClick = useCallback((event: MouseEvent) => {
    event.stopPropagation();
  }, []);

  const closeHumidityModal = useCallback(() => {
    setIsHumidityModalOpen(false);
  }, []);

  const openHumidityModal = useCallback(() => {
    setIsHumidityModalOpen(true);
  }, []);

  const closeTemperatureModal = useCallback(() => {
    setIsTemperatureModalOpen(false);
  }, []);

  const openTemperatureModal = useCallback(() => {
    setIsTemperatureModalOpen(true);
  }, []);

  const onHumiditySubmit = useCallback(() => {
    fetch("http://localhost:8080/configure-humidity", {
      method: "POST",
      body: JSON.stringify({
        humidity: Math.round(humidity * 100).toString(),
      }),
      headers: {
        ["Content-Type"]: "application/json",
      },
    })
      .then((response) => response.json())
      .then(console.log)
      .catch(console.error);

    closeHumidityModal();
  }, [closeHumidityModal, humidity]);

  const onTemperatureSubmit = useCallback(() => {
    fetch("http://localhost:8080/configure-temperature", {
      method: "POST",
      body: JSON.stringify({
        temperature: Math.round(temperature * 100).toString(),
      }),
      headers: {
        ["Content-Type"]: "application/json",
      },
    })
      .then((response) => response.json())
      .then(console.log)
      .catch(console.error);

    closeTemperatureModal();
  }, [closeTemperatureModal, temperature]);

  const onWaterPlantClick = useCallback(() => {
    fetch("http://localhost:8080/irrigate", {
      method: "POST",
    })
      .then((response) => response.json())
      .then(console.log)
      .catch(console.error);
  }, []);

  const openConfigureIntervalModal = useCallback(() => {
    setIsTimeIntervalModalOpen(true);
  }, []);

  const closeConfigureIntervalModal = useCallback(() => {
    setIsTimeIntervalModalOpen(false);
  }, []);

  const onTimeIntervalChange = useCallback(
    (event: ChangeEvent<FormElement>) => {
      setTimeInterval(event.target.value);
    },
    []
  );

  const onIntervalSubmit = useCallback(() => {
    fetch("http://localhost:8080/configure-interval", {
      method: "POST",
      body: JSON.stringify({
        interval: timeInterval,
      }),
      headers: {
        ["Content-Type"]: "application/json",
      },
    })
      .then((response) => response.json())
      .then(console.log)
      .catch(console.error);

    closeConfigureIntervalModal();
  }, [closeConfigureIntervalModal, timeInterval]);

  useEffect(() => {
    const getData = () => {
      fetch("http://localhost:8080/current-data")
        .then((response) => response.json())
        .then((formattedResponse) =>
          setCurrentData({
            temperature: formattedResponse[0],
            humidity: formattedResponse[1],
            mins: formattedResponse[2],
          })
        )
        .catch(console.error);
    };

    if (currentData) {
      setTimeout(getData, 60000);
    } else {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>GreenHouse</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Container
          display="flex"
          justify="flex-end"
          css={{ width: "100%", paddingRight: "10rem" }}
        >
          <Button
            color="secondary"
            auto
            bordered
            icon={
              <Image
                src={TimeInterval}
                alt="Time Interval"
                height={25}
                width={25}
              />
            }
            onPress={openConfigureIntervalModal}
          >
            Configure Time Interval
          </Button>
        </Container>
        <Grid.Container gap={2} justify="center" css={{ marginBlock: "2rem" }}>
          <Grid xs={3} direction="column" justify="center">
            <Text
              b
              css={{
                textAlign: "center",
              }}
            >
              {currentData?.humidity} %
            </Text>
            <Text
              css={{
                textAlign: "center",
              }}
            >
              Humidity
            </Text>
          </Grid>
          <Grid xs={3} direction="column" justify="center">
            <Text
              b
              css={{
                textAlign: "center",
              }}
            >
              {currentData?.temperature} ??C
            </Text>
            <Text
              css={{
                textAlign: "center",
              }}
            >
              Temperature
            </Text>
          </Grid>
          <Grid xs={3} direction="column" justify="center">
            <Text
              b
              css={{
                textAlign: "center",
              }}
            >
              {currentData?.mins} mins
            </Text>
            <Text
              css={{
                textAlign: "center",
              }}
            >
              Last time watered
            </Text>
          </Grid>
        </Grid.Container>

        <h1 className={styles.title}>
          Welcome to <span>GreenHouse!</span>
        </h1>

        <Button
          size="xl"
          bordered
          color="primary"
          rounded
          icon={
            <Image
              src={WateringCan}
              alt="Water your plant"
              height={25}
              width={25}
            />
          }
          onPress={onWaterPlantClick}
        >
          Water your plant
        </Button>
        <Grid.Container gap={2} justify="center" css={{ marginTop: "1rem" }}>
          <Grid xs={6} sm={3}>
            <Card isPressable onClick={openHumidityModal}>
              <Card.Body>
                <Row justify="space-between" align="center">
                  <Container
                    display="flex"
                    wrap="nowrap"
                    gap={1}
                    alignItems="center"
                  >
                    <Image
                      src={Humidity}
                      alt="Humidity"
                      height={30}
                      width={30}
                    />
                    <Text b>Humidity</Text>
                  </Container>
                  <Container display="flex" justify="flex-end">
                    <Switch
                      color="success"
                      checked={true}
                      onChange={onHumidityCheckChange}
                      onClick={onSwitchClick}
                    />
                  </Container>
                </Row>
              </Card.Body>
            </Card>
          </Grid>
          <Grid xs={6} sm={3}>
            <Card isPressable onClick={openTemperatureModal}>
              <Card.Body>
                <Row justify="space-between" align="center">
                  <Container
                    display="flex"
                    wrap="nowrap"
                    gap={1}
                    alignItems="center"
                  >
                    <Image
                      src={Temperature}
                      alt="temperature"
                      height={30}
                      width={30}
                    />
                    <Text b>Temperature</Text>
                  </Container>
                  <Container
                    display="flex"
                    justify="flex-end"
                    css={{ width: "10rem" }}
                  >
                    <Switch
                      color="success"
                      checked={true}
                      onChange={onTemperatureCheckChange}
                      onClick={onSwitchClick}
                    />
                  </Container>
                </Row>
              </Card.Body>
            </Card>
          </Grid>
        </Grid.Container>
        <Modal
          closeButton
          blur
          aria-labelledby="modal-title"
          open={isHumidityModalOpen}
          onClose={closeHumidityModal}
        >
          <Modal.Header>
            <Text h3>Configure Humidity</Text>
          </Modal.Header>
          <Modal.Body>
            <Container
              display="flex"
              alignItems="center"
              justify="center"
              css={{ p: "1rem" }}
            >
              <CircularInput value={humidity} onChange={setHumidity}>
                <CircularTrack />
                <CircularProgress />
                <CircularThumb />
                <text
                  x={100}
                  y={100}
                  textAnchor="middle"
                  dy="0.3em"
                  fontWeight="bold"
                  fontSize={34}
                >
                  {Math.round(humidity * 100)}%
                </text>
              </CircularInput>
            </Container>
          </Modal.Body>
          <Modal.Footer justify="center">
            <Button color="primary" onPress={onHumiditySubmit}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          closeButton
          blur
          aria-labelledby="modal-title"
          open={isTemperatureModalOpen}
          onClose={closeTemperatureModal}
        >
          <Modal.Header>
            <Text h3>Configure Temperature</Text>
          </Modal.Header>
          <Modal.Body>
            <Container
              display="flex"
              alignItems="center"
              justify="center"
              css={{ p: "1rem" }}
            >
              <CircularInput value={temperature} onChange={setTemperature}>
                <CircularTrack />
                <CircularProgress />
                <CircularThumb />
                <text
                  x={100}
                  y={100}
                  textAnchor="middle"
                  dy="0.3em"
                  fontWeight="bold"
                  fontSize={34}
                >
                  {Math.round(temperature * 100)}??C
                </text>
              </CircularInput>
            </Container>
          </Modal.Body>
          <Modal.Footer justify="center">
            <Button color="primary" onPress={onTemperatureSubmit}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          closeButton
          blur
          aria-labelledby="modal-title"
          open={isTimeIntervalModalOpen}
          onClose={closeConfigureIntervalModal}
        >
          <Modal.Header>
            <Text h3>Configure Time Interval</Text>
          </Modal.Header>
          <Modal.Body>
            <Container
              display="flex"
              alignItems="center"
              justify="center"
              css={{ p: "1rem" }}
            >
              <Input
                label="Interval (in mins)"
                placeholder="5"
                type="number"
                labelRight="mins"
                value={timeInterval}
                onChange={onTimeIntervalChange}
              />
            </Container>
          </Modal.Body>
          <Modal.Footer justify="center">
            <Button color="primary" onPress={onIntervalSubmit}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </div>
  );
};

export default Home;
