import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";

// // static import
import demoProductList from "../../data/data.json";
import "./style.scss";

function Product() {
  // // local state
  const [selectedPayoutType, setSelectedPayoutType] =
    useState("allSubProducts");
  const [payoutValue, setPayOutValue] = useState();
  const [percentages, setPercentages] = useState({});
  const [selectedCategory, setSelectedCategory] = useState({});
  const [result, setResult] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // // Handle radio button change for payout type
  const handlePayoutType = (event) => {
    setSelectedPayoutType(event.target.value);
  };

  // // Handle checkbox change for sub-products
  const handleCheckboxChange = (event, id) => {
    const { name, checked } = event.target;
    setSelectedCategory({
      ...selectedCategory,
      [name]: checked,
    });
    if (checked) {
      setResult([
        ...result,
        { name, sub_product_id: id, percentage: percentages[name] },
      ]);
    } else {
      setResult(result.filter((item) => item.name !== name));
    }
  };

  // // Handle Select All checkbox change
  const handleSelectAllChange = (event) => {
    const { checked } = event.target;
    setSelectAll(checked);
    const updatedSelectedCategory = {};
    demoProductList.forEach((item) => {
      updatedSelectedCategory[item.category_name] = checked;
    });
    setSelectedCategory(updatedSelectedCategory);

    if (checked) {
      const newResult = [];
      Object.keys(updatedSelectedCategory).forEach((name) => {
        newResult.push({
          name,
          sub_product_id: demoProductList.find(
            (item) => item.category_name === name
          ).id,
          percentage: percentages[name] || "",
        });
      });
      setResult(newResult);
    } else {
      setResult([]);
    }
  };

  // // Handle percentage change for individual sub-products
  const handlePercentageChange = (event, id) => {
    const { name, value } = event.target;
    setPercentages({ ...percentages, [name]: value });

    const existingIndex = result.findIndex((item) => item.name === name);
    if (existingIndex !== -1) {
      setResult([
        ...result.slice(0, existingIndex),
        { name, sub_product_id: id, percentage: value },
        ...result.slice(existingIndex + 1),
      ]);
    }
  };

  // // Set initial percentages for all sub-products if payout type is 'allSubProducts'
  useEffect(() => {
    if (selectedPayoutType === "allSubProducts") {
      const updatedPercentages = {};
      demoProductList.forEach((item) => {
        updatedPercentages[item.category_name] = payoutValue || "";
      });
      setPercentages(updatedPercentages);
      setResult((prev) =>
        prev.map((item) => ({ ...item, percentage: payoutValue }))
      );
    }
  }, [selectedPayoutType, payoutValue]);

  // console.log(percentages);
  // console.log(payoutValue);
  console.log(result);
  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={5}>
          <div>
            <input
              type="radio"
              value="allSubProducts"
              checked={selectedPayoutType === "allSubProducts"}
              name="payout"
              id="allSubProducts"
              onChange={handlePayoutType}
            />
            <label for="allSubProducts">
              Set flat payout % for all sub-products
            </label>
          </div>
          <div>
            <input
              type="radio"
              value="singleSubProducts"
              checked={selectedPayoutType === "singleSubProducts"}
              name="payout"
              id="singleSubProducts"
              onChange={handlePayoutType}
            />

            <label for="singleSubProducts">
              Set flat payout % per sub-products
            </label>
          </div>
          {selectedPayoutType === "allSubProducts" && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <label>Enter flat payout</label>
              <div className="d-flex align-items-center">
                <Input
                  type="number"
                  min={1}
                  name="flatPayout"
                  onChange={(e) => setPayOutValue(e.target.value)}
                  value={payoutValue}
                />
                %
              </div>
            </div>
          )}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <p>Sub Products</p>
            <p>Payout %</p>
          </div>

          <FormGroup check>
            <Input
              id="selectAll"
              name="selectAll"
              type="checkbox"
              className="mb-0"
              checked={selectAll}
              onChange={handleSelectAllChange}
            />
            <Label for="selectAll" className="mb-0">
              Select All
            </Label>
          </FormGroup>

          {demoProductList?.map((item) => (
            <div
              className="d-flex justify-content-between align-items-center mt-2"
              key={item?.id}
            >
              <FormGroup check>
                <Input
                  id={item.category_name}
                  name={item.category_name}
                  type="checkbox"
                  className="mb-0"
                  checked={selectedCategory[item.category_name] || false}
                  onChange={(e) => handleCheckboxChange(e, item?.id)}
                />
                <Label for={item.category_name} className="mb-0">
                  {item.category_name}
                </Label>
              </FormGroup>
              <div className="d-flex align-items-center">
                <Input
                  type="number"
                  min={1}
                  name={item.category_name}
                  disabled={selectedPayoutType === "allSubProducts"}
                  value={
                    selectedPayoutType === "allSubProducts"
                      ? payoutValue
                      : percentages[item.category_name] || ""
                  }
                  onChange={(e) => handlePercentageChange(e, item?.id)}
                />
                %
              </div>
            </div>
          ))}

          <Button className="w-100 mt-5">Submit</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Product;
