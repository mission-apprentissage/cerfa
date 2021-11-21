import React from "react";
import { Box, Button, FormControl, FormLabel, Input, FormErrorMessage, Text, Flex, HStack } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";

// import { _post, _get, _put } from "../../common/httpClient";

const FormContract = () => {
  const { values, handleChange, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      exemptionType: "",
      contractNumber: "",
      conclusionDate: "",
      startedContractDate: "",
      effectDate: "",
      endContractDate: "",
      hours: "",
      minutes: "",
      workDangerous: "",
      firstYearPayStartedDate: "",
      firstYearPayEndDate: "",
      firstYearPayPercentage: "",
      firstYearPaySmicOrSmec: "",
      firstYear2PayStartedDate: "",
      firstYear2PayEndDate: "",
      firstYear2PayPercentage: "",
      firstYear2PaySmicOrSmec: "",
      secondYearPayStartedDate: "",
      secondYearPayEndDate: "",
      secondYearPayPercentage: "",
      secondYearPaySmicOrSmec: "",
      secondYear2PayStartedDate: "",
      secondYear2PayEndDate: "",
      secondYear2PayPercentage: "",
      secondYear2PaySmicOrSmec: "",
      thirdYearPayStartedDate: "",
      thirdYearPayEndDate: "",
      thirdYearPayPercentage: "",
      thirdYearPaySmicOrSmec: "",
      thirdYear2PayStartedDate: "",
      thirdYear2PayEndDate: "",
      thirdYear2PayPercentage: "",
      thirdYear2PaySmicOrSmec: "",
      fourthYearPayStartedDate: "",
      fourthYearPayEndDate: "",
      fourthYearPayPercentage: "",
      fourthYearPaySmicOrSmec: "",
      fourthYear2PayStartedDate: "",
      fourthYear2PayEndDate: "",
      fourthYear2PayPercentage: "",
      fourthYear2PaySmicOrSmec: "",
      monthlyGrossSalary: "",
      pensionFund: "",
      food: "",
      lodging: "",
      other: "",
    },
    validationSchema: Yup.object().shape({
      contractType: Yup.string().required("Requis"),
      exemptionType: Yup.string().required("Requis"),
      contractNumber: Yup.string().required("Requis"),
      conclusionDate: Yup.string().required("Requis"),
      startedContractDate: Yup.string().required("Requis"),
      effectDate: Yup.string().required("Requis"),
      endContractDate: Yup.string().required("Requis"),
      hours: Yup.string().required("Requis"),
      minutes: Yup.string().required("Requis"),
      workDangerous: Yup.string().required("Requis"),
      firstYearPayStartedDate: Yup.string().required("Requis"),
      firstYearPayEndDate: Yup.string().required("Requis"),
      firstYearPayPercentage: Yup.string().required("Requis"),
      firstYearPaySmicOrSmec: Yup.string().required("Requis"),
      firstYear2PayStartedDate: Yup.string().required("Requis"),
      firstYear2PayEndDate: Yup.string().required("Requis"),
      firstYear2PayPercentage: Yup.string().required("Requis"),
      firstYear2PaySmicOrSmec: Yup.string().required("Requis"),
      secondYearPayStartedDate: Yup.string().required("Requis"),
      secondYearPayEndDate: Yup.string().required("Requis"),
      secondYearPayPercentage: Yup.string().required("Requis"),
      secondYearPaySmicOrSmec: Yup.string().required("Requis"),
      secondYear2PayStartedDate: Yup.string().required("Requis"),
      secondYear2PayEndDate: Yup.string().required("Requis"),
      secondYear2PayPercentage: Yup.string().required("Requis"),
      secondYear2PaySmicOrSmec: Yup.string().required("Requis"),
      thirdYearPayStartedDate: Yup.string().required("Requis"),
      thirdYearPayEndDate: Yup.string().required("Requis"),
      thirdYearPayPercentage: Yup.string().required("Requis"),
      thirdYearPaySmicOrSmec: Yup.string().required("Requis"),
      thirdYear2PayStartedDate: Yup.string().required("Requis"),
      thirdYear2PayEndDate: Yup.string().required("Requis"),
      thirdYear2PayPercentage: Yup.string().required("Requis"),
      thirdYear2PaySmicOrSmec: Yup.string().required("Requis"),
      fourthtYearPayStartedDate: Yup.string().required("Requis"),
      fourthtYearPayEndDate: Yup.string().required("Requis"),
      fourthtYearPayPercentage: Yup.string().required("Requis"),
      fourthtYearPaySmicOrSmec: Yup.string().required("Requis"),
      fourthtYear2PayStartedDate: Yup.string().required("Requis"),
      fourthtYear2PayEndDate: Yup.string().required("Requis"),
      fourthtYear2PayPercentage: Yup.string().required("Requis"),
      fourthtYear2PaySmicOrSmec: Yup.string().required("Requis"),
      monthlyGrossSalary: Yup.string().required("Requis"),
      pensionFund: Yup.string().required("Requis"),
      food: Yup.string().required("Requis"),
      lodging: Yup.string().required("Requis"),
      other: Yup.string().required("Requis"),
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <Box>
      <Flex>
        <Box w="55%" flex="1">
          <FormControl isRequired mt={2} isInvalid={errors.contractType}>
            <FormLabel>Type de contrat ou d’avenant :</FormLabel>
            <Input type="text" name="contractType" onChange={handleChange} value={values.contractType} required />
            {errors.contractType && touched.contractType && <FormErrorMessage>{errors.contractType}</FormErrorMessage>}
          </FormControl>
          <FormControl isRequired mt={2} isInvalid={errors.exemptionType}>
            <FormLabel>Type de dérogation : </FormLabel>
            <Input type="text" name="exemptionType" onChange={handleChange} value={values.exemptionType} required />
            <Text textStyle="sm" fontStyle="italic">
              à renseigner si une dérogation existe pour ce contrat
            </Text>
            {errors.exemptionType && touched.exemptionType && (
              <FormErrorMessage>{errors.exemptionType}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isRequired mt={2} isInvalid={errors.contractNumber}>
            <FormLabel>Numéro du contrat précédent ou du contrat sur lequel porte l’avenant :</FormLabel>
            <Input type="text" name="contractNumber" onChange={handleChange} value={values.contractNumber} required />
            {errors.contractNumber && touched.contractNumber && (
              <FormErrorMessage>{errors.contractNumber}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isRequired mt={2} isInvalid={errors.conclusionDate}>
            <FormLabel>Date de conclusion :</FormLabel>
            <Input type="date" name="conclusionDate" onChange={handleChange} value={values.conclusionDate} required />
            <Text textStyle="sm">(Date de signature du présent contrat)</Text>
            {errors.conclusionDate && touched.conclusionDate && (
              <FormErrorMessage>{errors.conclusionDate}</FormErrorMessage>
            )}
          </FormControl>
        </Box>
        <Box w="55%" ml="5w">
          <FormControl isRequired mt={2} isInvalid={errors.startedContractDate}>
            <FormLabel>Date de début d’exécution du contrat :</FormLabel>
            <Input
              type="date"
              name="startedContractDate"
              onChange={handleChange}
              value={values.startedContractDate}
              required
            />
            {errors.startedContractDate && touched.startedContractDate && (
              <FormErrorMessage>{errors.startedContractDate}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isRequired mt={2} isInvalid={errors.effectDate}>
            <FormLabel>Si avenant, date d’effet :</FormLabel>
            <Input type="date" name="effectDate" onChange={handleChange} value={values.effectDate} required />
            {errors.effectDate && touched.effectDate && <FormErrorMessage>{errors.effectDate}</FormErrorMessage>}
          </FormControl>
          <FormControl isRequired mt={2} isInvalid={errors.endContractDate}>
            <FormLabel>Date de fin du contrat ou de la période d’apprentissage :</FormLabel>
            <Input type="date" name="endContractDate" onChange={handleChange} value={values.endContractDate} required />
            {errors.endContractDate && touched.endContractDate && (
              <FormErrorMessage>{errors.endContractDate}</FormErrorMessage>
            )}
          </FormControl>
          <FormLabel my={3} fontWeight={700}>
            Durée hebdomadaire du travail :
          </FormLabel>
          <Flex>
            <FormControl isRequired mt={2} isInvalid={errors.hours}>
              <FormLabel>heures</FormLabel>
              <Input type="number" name="hours" onChange={handleChange} value={values.hours} required />
              {errors.hours && touched.hours && <FormErrorMessage>{errors.hours}</FormErrorMessage>}
            </FormControl>
            <FormControl isRequired mt={2} isInvalid={errors.minutes} flex="1" ml={5}>
              <FormLabel ml="rem">minutes</FormLabel>
              <Input type="number" name="minutes" onChange={handleChange} value={values.minutes} required />
              {errors.minutes && touched.minutes && <FormErrorMessage>{errors.minutes}</FormErrorMessage>}
            </FormControl>
          </Flex>
        </Box>
      </Flex>
      <Box pt={4}>
        <FormControl>
          <Flex>
            <FormLabel>Travail sur machines dangereuses ou exposition à des risques particuliers :</FormLabel>
            <HStack w="40%">
              <Flex alignItems="center">
                <input
                  type="radio"
                  name="workDangerous"
                  value="oui"
                  checked={values.workDangerous === "oui"}
                  onChange={handleChange}
                />
                <Text ml="1w">oui</Text>
              </Flex>
              <Flex alignItems="center">
                <input
                  type="radio"
                  name="workDangerous"
                  value="non"
                  checked={values.workDangerous === "non"}
                  onChange={handleChange}
                />
                <Text ml="1w">non »</Text>
              </Flex>
            </HStack>
          </Flex>
          {errors.workDangerous && touched.workDangerous && <FormErrorMessage>{errors.workDangerous}</FormErrorMessage>}
        </FormControl>
        <FormLabel fontWeight={700}>Rémunération</FormLabel>
        <FormLabel fontSize="zeta">1 re année, du</FormLabel>
        <Box>
          <Flex>
            <FormControl isRequired isInvalid={errors.firstYearPayStartedDate}>
              <Input
                type="date"
                name="firstYearPayStartedDate"
                onChange={handleChange}
                value={values.firstYearPayStartedDate}
                required
              />
              {errors.firstYearPayStartedDate && touched.firstYearPayStartedDate && (
                <FormErrorMessage>{errors.firstYearPayStartedDate}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired ml={4} isInvalid={errors.firstYearPayEndDate}>
              <Flex>
                <FormLabel fontSize="zeta">au</FormLabel>
                <Input
                  type="date"
                  name="firstYearPayEndDate"
                  onChange={handleChange}
                  value={values.firstYearPayEndDate}
                  required
                />
              </Flex>
              {errors.firstYearPayEndDate && touched.firstYearPayEndDate && (
                <FormErrorMessage>{errors.firstYearPayEndDate}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired ml={4} isInvalid={errors.firstYearPayPercentage}>
              <Flex>
                <FormLabel fontSize="zeta">:</FormLabel>
                <Input
                  type="number"
                  name="firstYearPayPercentage"
                  onChange={handleChange}
                  value={values.firstYearPayPercentage}
                  required
                />
                %
              </Flex>
              {errors.firstYearPayPercentage && touched.firstYearPayPercentage && (
                <FormErrorMessage>{errors.firstYearPayPercentage}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl ml={4} isRequired isInvalid={errors.firstYearPaySmicOrSmec}>
              <Flex>
                <FormLabel fontSize="zeta">du</FormLabel>
                <Input
                  type="text"
                  name="firstYearPaySmicOrSmec"
                  onChange={handleChange}
                  value={values.firstYearPaySmicOrSmec}
                  required
                />
                ;
              </Flex>
              {errors.firstYearPaySmicOrSmec && touched.firstYearPaySmicOrSmec && (
                <FormErrorMessage>{errors.firstYearPaySmicOrSmec}</FormErrorMessage>
              )}
            </FormControl>
          </Flex>
          <Flex mt={4}>
            <FormControl isInvalid={errors.firstYear2PayStartedDate}>
              <Input
                type="date"
                name="firstYear2PayStartedDate"
                onChange={handleChange}
                value={values.firstYear2PayStartedDate}
              />
              {errors.firstYear2PayStartedDate && touched.firstYear2PayStartedDate && (
                <FormErrorMessage>{errors.firstYear2PayStartedDate}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl ml={4} isInvalid={errors.firstYear2PayEndDate}>
              <Flex>
                <FormLabel fontSize="zeta">au</FormLabel>
                <Input
                  type="date"
                  name="firstYear2PayEndDate"
                  onChange={handleChange}
                  value={values.firstYear2PayEndDate}
                />
              </Flex>
              {errors.firstYear2PayEndDate && touched.firstYear2PayEndDate && (
                <FormErrorMessage>{errors.firstYear2PayEndDate}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl ml={4} isInvalid={errors.firstYear2PayPercentage}>
              <Flex>
                <FormLabel fontSize="zeta">:</FormLabel>
                <Input
                  type="number"
                  name="firstYear2PayPercentage"
                  onChange={handleChange}
                  value={values.firstYear2PayPercentage}
                />
                %
              </Flex>
              {errors.firstYear2PayPercentage && touched.firstYear2PayPercentage && (
                <FormErrorMessage>{errors.firstYear2PayPercentage}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl ml={4} isInvalid={errors.firstYear2PaySmicOrSmec}>
              <Flex>
                <FormLabel fontSize="zeta">du</FormLabel>
                <Input
                  type="text"
                  name="firstYear2PaySmicOrSmec"
                  onChange={handleChange}
                  value={values.firstYear2PaySmicOrSmec}
                />
                ;
              </Flex>
              {errors.firstYear2PaySmicOrSmec && touched.firstYear2PaySmicOrSmec && (
                <FormErrorMessage>{errors.firstYear2PaySmicOrSmec}</FormErrorMessage>
              )}
            </FormControl>
          </Flex>
        </Box>
        <FormLabel fontSize="zeta" mt={2}>
          2 eme année, du
        </FormLabel>
        <Box>
          <Flex>
            <FormControl isRequired isInvalid={errors.secondYearPayStartedDate}>
              <Input
                type="date"
                name="secondYearPayStartedDate"
                onChange={handleChange}
                value={values.secondYearPayStartedDate}
                required
              />
              {errors.secondYearPayStartedDate && touched.secondYearPayStartedDate && (
                <FormErrorMessage>{errors.secondYearPayStartedDate}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired ml={4} isInvalid={errors.secondYearPayEndDate}>
              <Flex>
                <FormLabel fontSize="zeta">au</FormLabel>
                <Input
                  type="date"
                  name="secondYearPayEndDate"
                  onChange={handleChange}
                  value={values.secondYearPayEndDate}
                  required
                />
              </Flex>
              {errors.secondYearPayEndDate && touched.secondYearPayEndDate && (
                <FormErrorMessage>{errors.secondYearPayEndDate}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired ml={4} isInvalid={errors.secondYearPayPercentage}>
              <Flex>
                <FormLabel fontSize="zeta">:</FormLabel>
                <Input
                  type="number"
                  name="secondYearPayPercentage"
                  onChange={handleChange}
                  value={values.secondYearPayPercentage}
                  required
                />
                %
              </Flex>
              {errors.secondYearPayPercentage && touched.secondYearPayPercentage && (
                <FormErrorMessage>{errors.secondYearPayPercentage}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl ml={4} isRequired isInvalid={errors.secondYearPaySmicOrSmec}>
              <Flex>
                <FormLabel fontSize="zeta">du</FormLabel>
                <Input
                  type="text"
                  name="secondYearPaySmicOrSmec"
                  onChange={handleChange}
                  value={values.secondYearPaySmicOrSmec}
                  required
                />
                ;
              </Flex>
              {errors.secondYearPaySmicOrSmec && touched.secondYearPaySmicOrSmec && (
                <FormErrorMessage>{errors.secondYearPaySmicOrSmec}</FormErrorMessage>
              )}
            </FormControl>
          </Flex>
          <Flex mt={4}>
            <FormControl isInvalid={errors.secondYear2PayStartedDate}>
              <Input
                type="date"
                name="secondYear2PayStartedDate"
                onChange={handleChange}
                value={values.secondYear2PayStartedDate}
              />
              {errors.secondYear2PayStartedDate && touched.secondYear2PayStartedDate && (
                <FormErrorMessage>{errors.secondYear2PayStartedDate}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl ml={4} isInvalid={errors.secondYear2PayEndDate}>
              <Flex>
                <FormLabel fontSize="zeta">au</FormLabel>
                <Input
                  type="date"
                  name="secondYear2PayEndDate"
                  onChange={handleChange}
                  value={values.secondYear2PayEndDate}
                />
              </Flex>
              {errors.secondYear2PayEndDate && touched.secondYear2PayEndDate && (
                <FormErrorMessage>{errors.secondYear2PayEndDate}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl ml={4} isInvalid={errors.secondYear2PayPercentage}>
              <Flex>
                <FormLabel fontSize="zeta">:</FormLabel>
                <Input
                  type="number"
                  name="secondYear2PayPercentage"
                  onChange={handleChange}
                  value={values.secondYear2PayPercentage}
                />
                %
              </Flex>
              {errors.secondYear2PayPercentage && touched.secondYear2PayPercentage && (
                <FormErrorMessage>{errors.secondYear2PayPercentage}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl ml={4} isInvalid={errors.secondYear2PaySmicOrSmec}>
              <Flex>
                <FormLabel fontSize="zeta">du</FormLabel>
                <Input
                  type="text"
                  name="secondYear2PaySmicOrSmec"
                  onChange={handleChange}
                  value={values.secondYear2PaySmicOrSmec}
                />
                ;
              </Flex>
              {errors.secondYear2PaySmicOrSmec && touched.secondYear2PaySmicOrSmec && (
                <FormErrorMessage>{errors.secondYear2PaySmicOrSmec}</FormErrorMessage>
              )}
            </FormControl>
          </Flex>
        </Box>
        <FormLabel fontSize="zeta" mt={2}>
          3 eme année, du
        </FormLabel>
        <Box>
          <Flex>
            <FormControl isRequired isInvalid={errors.thirdYearPayStartedDate}>
              <Input
                type="date"
                name="thirdYearPayStartedDate"
                onChange={handleChange}
                value={values.thirdYearPayStartedDate}
                required
              />
              {errors.thirdYearPayStartedDate && touched.thirdYearPayStartedDate && (
                <FormErrorMessage>{errors.thirdYearPayStartedDate}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired ml={4} isInvalid={errors.thirdYearPayEndDate}>
              <Flex>
                <FormLabel fontSize="zeta">au</FormLabel>
                <Input
                  type="date"
                  name="thirdYearPayEndDate"
                  onChange={handleChange}
                  value={values.thirdYearPayEndDate}
                  required
                />
              </Flex>
              {errors.thirdYearPayEndDate && touched.thirdYearPayEndDate && (
                <FormErrorMessage>{errors.thirdYearPayEndDate}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired ml={4} isInvalid={errors.thirdYearPayPercentage}>
              <Flex>
                <FormLabel fontSize="zeta">:</FormLabel>
                <Input
                  type="number"
                  name="thirdYearPayPercentage"
                  onChange={handleChange}
                  value={values.thirdYearPayPercentage}
                  required
                />
                %
              </Flex>
              {errors.thirdYearPayPercentage && touched.thirdYearPayPercentage && (
                <FormErrorMessage>{errors.thirdYearPayPercentage}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl ml={4} isRequired isInvalid={errors.thirdYearPaySmicOrSmec}>
              <Flex>
                <FormLabel fontSize="zeta">du</FormLabel>
                <Input
                  type="text"
                  name="thirdYearPaySmicOrSmec"
                  onChange={handleChange}
                  value={values.thirdYearPaySmicOrSmec}
                  required
                />
                ;
              </Flex>
              {errors.thirdYearPaySmicOrSmec && touched.thirdYearPaySmicOrSmec && (
                <FormErrorMessage>{errors.thirdYearPaySmicOrSmec}</FormErrorMessage>
              )}
            </FormControl>
          </Flex>
          <Flex mt={4}>
            <FormControl isInvalid={errors.thirdYear2PayStartedDate}>
              <Input
                type="date"
                name="thirdYear2PayStartedDate"
                onChange={handleChange}
                value={values.thirdYear2PayStartedDate}
              />
              {errors.thirdYear2PayStartedDate && touched.thirdYear2PayStartedDate && (
                <FormErrorMessage>{errors.thirdYear2PayStartedDate}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl ml={4} isInvalid={errors.thirdYear2PayEndDate}>
              <Flex>
                <FormLabel fontSize="zeta">au</FormLabel>
                <Input
                  type="date"
                  name="thirdYear2PayEndDate"
                  onChange={handleChange}
                  value={values.thirdYear2PayEndDate}
                />
              </Flex>
              {errors.thirdYear2PayEndDate && touched.thirdYear2PayEndDate && (
                <FormErrorMessage>{errors.thirdYear2PayEndDate}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl ml={4} isInvalid={errors.thirdYear2PayPercentage}>
              <Flex>
                <FormLabel fontSize="zeta">:</FormLabel>
                <Input
                  type="number"
                  name="thirdYear2PayPercentage"
                  onChange={handleChange}
                  value={values.thirdYear2PayPercentage}
                />
                %
              </Flex>
              {errors.thirdYear2PayPercentage && touched.thirdYear2PayPercentage && (
                <FormErrorMessage>{errors.thirdYear2PayPercentage}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl ml={4} isInvalid={errors.thirdYear2PaySmicOrSmec}>
              <Flex>
                <FormLabel fontSize="zeta">du</FormLabel>
                <Input
                  type="text"
                  name="thirdYear2PaySmicOrSmec"
                  onChange={handleChange}
                  value={values.thirdYear2PaySmicOrSmec}
                />
                ;
              </Flex>
              {errors.thirdYear2PaySmicOrSmec && touched.thirdYear2PaySmicOrSmec && (
                <FormErrorMessage>{errors.thirdYear2PaySmicOrSmec}</FormErrorMessage>
              )}
            </FormControl>
          </Flex>
        </Box>
        <FormLabel fontSize="zeta" mt={2}>
          4 eme année, du
        </FormLabel>
        <Box>
          <Flex>
            <FormControl isRequired isInvalid={errors.fourthYearPayStartedDate}>
              <Input
                type="date"
                name="fourthYearPayStartedDate"
                onChange={handleChange}
                value={values.fourthYearPayStartedDate}
                required
              />
              {errors.fourthYearPayStartedDate && touched.fourthYearPayStartedDate && (
                <FormErrorMessage>{errors.fourthYearPayStartedDate}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired ml={4} isInvalid={errors.fourthYearPayEndDate}>
              <Flex>
                <FormLabel fontSize="zeta">au</FormLabel>
                <Input
                  type="date"
                  name="fourthYearPayEndDate"
                  onChange={handleChange}
                  value={values.fourthYearPayEndDate}
                  required
                />
              </Flex>
              {errors.fourthYearPayEndDate && touched.fourthYearPayEndDate && (
                <FormErrorMessage>{errors.fourthYearPayEndDate}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired ml={4} isInvalid={errors.fourthYearPayPercentage}>
              <Flex>
                <FormLabel fontSize="zeta">:</FormLabel>
                <Input
                  type="number"
                  name="fourthYearPayPercentage"
                  onChange={handleChange}
                  value={values.fourthYearPayPercentage}
                  required
                />
                %
              </Flex>
              {errors.fourthYearPayPercentage && touched.fourthYearPayPercentage && (
                <FormErrorMessage>{errors.fourthYearPayPercentage}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl ml={4} isRequired isInvalid={errors.fourthYearPaySmicOrSmec}>
              <Flex>
                <FormLabel fontSize="zeta">du</FormLabel>
                <Input
                  type="text"
                  name="fourthYearPaySmicOrSmec"
                  onChange={handleChange}
                  value={values.fourthYearPaySmicOrSmec}
                  required
                />
                ;
              </Flex>
              {errors.fourthYearPaySmicOrSmec && touched.fourthYearPaySmicOrSmec && (
                <FormErrorMessage>{errors.fourthYearPaySmicOrSmec}</FormErrorMessage>
              )}
            </FormControl>
          </Flex>
          <Flex mt={4}>
            <FormControl isInvalid={errors.fourthYear2PayStartedDate}>
              <Input
                type="date"
                name="fourthYear2PayStartedDate"
                onChange={handleChange}
                value={values.fourthYear2PayStartedDate}
              />
              {errors.fourthYear2PayStartedDate && touched.fourthYear2PayStartedDate && (
                <FormErrorMessage>{errors.fourthYear2PayStartedDate}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl ml={4} isInvalid={errors.fourthYear2PayEndDate}>
              <Flex>
                <FormLabel fontSize="zeta">au</FormLabel>
                <Input
                  type="date"
                  name="fourthYear2PayEndDate"
                  onChange={handleChange}
                  value={values.fourthYear2PayEndDate}
                />
              </Flex>
              {errors.fourthYear2PayEndDate && touched.fourthYear2PayEndDate && (
                <FormErrorMessage>{errors.fourthYear2PayEndDate}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl ml={4} isInvalid={errors.fourthYear2PayPercentage}>
              <Flex>
                <FormLabel fontSize="zeta">:</FormLabel>
                <Input
                  type="number"
                  name="fourthYear2PayPercentage"
                  onChange={handleChange}
                  value={values.fourthYear2PayPercentage}
                />
                %
              </Flex>
              {errors.fourthYear2PayPercentage && touched.fourthYear2PayPercentage && (
                <FormErrorMessage>{errors.fourthYear2PayPercentage}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl ml={4} isInvalid={errors.fourthYear2PaySmicOrSmec}>
              <Flex>
                <FormLabel fontSize="zeta">du</FormLabel>
                <Input
                  type="text"
                  name="fourthYear2PaySmicOrSmec"
                  onChange={handleChange}
                  value={values.fourthYear2PaySmicOrSmec}
                />
                ;
              </Flex>
              {errors.fourthYear2PaySmicOrSmec && touched.fourthYear2PaySmicOrSmec && (
                <FormErrorMessage>{errors.fourthYear2PaySmicOrSmec}</FormErrorMessage>
              )}
            </FormControl>
          </Flex>
        </Box>
        <Flex mt={5}>
          <Box w="55%" flex="1">
            <FormControl isRequired mt={2} isInvalid={errors.monthlyGrossSalary}>
              <FormLabel fontWeight={700}>Salaire brut mensuel à l’embauche :</FormLabel>
              <Input
                type="number"
                name="monthlyGrossSalary"
                onChange={handleChange}
                value={values.monthlyGrossSalary}
                required
              />
              {errors.monthlyGrossSalary && touched.monthlyGrossSalary && (
                <FormErrorMessage>{errors.monthlyGrossSalary}</FormErrorMessage>
              )}
            </FormControl>
          </Box>
          <Box w="55%" ml={5}>
            <FormControl isRequired mt={2} isInvalid={errors.pensionFund}>
              <FormLabel fontWeight={700}>Caisse de retraite complémentaire :</FormLabel>
              <Input type="text" name="pensionFund" onChange={handleChange} value={values.pensionFund} required />
              {errors.pensionFund && touched.pensionFund && <FormErrorMessage>{errors.pensionFund}</FormErrorMessage>}
            </FormControl>
          </Box>
        </Flex>
        <FormLabel my={4} fontWeight={700}>
          Avantages en nature, le cas échéant :
        </FormLabel>
        <Flex>
          <Box flex="1">
            <FormControl isRequired mt={2} isInvalid={errors.food}>
              <Flex>
                <FormLabel fontWeight={700}>Nourriture</FormLabel>
                <Input type="number" name="food" onChange={handleChange} value={values.food} required />€ / repas
              </Flex>
              {errors.food && touched.food && <FormErrorMessage>{errors.food}</FormErrorMessage>}
            </FormControl>
          </Box>
          <Box ml={5}>
            <FormControl isRequired mt={2} isInvalid={errors.lodging}>
              <Flex>
                <FormLabel fontWeight={700}>Logement</FormLabel>
                <Input type="number" name="lodging" onChange={handleChange} value={values.lodging} required />€ / mois
              </Flex>
              {errors.lodging && touched.lodging && <FormErrorMessage>{errors.lodging}</FormErrorMessage>}
            </FormControl>
          </Box>
        </Flex>
        <Box>
          <FormControl isRequired mt={2} isInvalid={errors.other}>
            <FormLabel fontWeight={700}>Autre :</FormLabel>
            <Input type="text" name="other" onChange={handleChange} value={values.other} required />
            {errors.other && touched.other && <FormErrorMessage>{errors.other}</FormErrorMessage>}
          </FormControl>
        </Box>
      </Box>
      <Box mt="2rem">
        <Button variant="primary" ml={3} onClick={handleSubmit} type="submit">
          Enregistrer
        </Button>
      </Box>
    </Box>
  );
};

export default FormContract;
