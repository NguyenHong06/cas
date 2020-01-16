import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { NavLink as RouterNavLink } from "react-router-dom";
import NumberFormat from 'react-number-format';
import APIFunction from './../../services';
import {
  Grid,
  IconButton,
  Link,
  Breadcrumbs as MuiBreadcrumbs,
  Card as MuiCard,
  Divider as MuiDivider,
  Paper as MuiPaper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
  Avatar,
  ListItemIcon,
  Menu,
  MenuItem,
  Button,
  ListItemText as MuiListItemText,
  CircularProgress as Loading,
  // withStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  InputAdornment,
  Fab,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import {
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  FileCopyOutlined as FileCopy,
  Edit,
  DeleteOutline,
  MoreVert as MoreVertIcon,
  BlockTwoTone as BlockTwoToneIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
} from "@material-ui/icons";

import { spacing } from "@material-ui/system";

const NavLink = React.forwardRef((props, ref) => (
  <RouterNavLink innerRef={ref} {...props} />
));

const Card = styled(MuiCard)(spacing);

// const CardContent = styled(MuiCardContent)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Paper = styled(MuiPaper)(spacing);

const ListItemText = styled(MuiListItemText)(spacing);

const styles = theme => ({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
  },
});

const Spacer = styled.div`
  flex: 1 1 100%;
`;

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${props => props.theme.spacing(12)}px);
`;

const CircularProgress = styled.div`
  margin: 0 auto;
  text-align: center;
`;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TransitionLeft = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

// function createData(id, product_code, image, product_name, price, quantity, category_name) {
//   return { id, product_code, image, product_name, price, quantity, category_name };
// }

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  {
    id: "product_code",
    numeric: false,
    disablePadding: true,
    label: "SKU"
  },
  { id: "image", numeric: false, disablePadding: false, label: "Hình đại diện" },
  { id: "product_name", numeric: false, disablePadding: false, label: "Tên sản phẩm" },
  { id: "price", numeric: true, disablePadding: false, label: "Giá" },
  { id: "quantity", numeric: true, disablePadding: false, label: "Số lượng" },
  { id: "category_name", numeric: false, disablePadding: false, label: "Danh mục" },
  { id: "action", numeric: false, disablePadding: false, label: "Action" },

];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? "right" : "left"}
                padding={row.disablePadding ? "none" : "default"}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? "bottom-end" : "bottom-start"}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this
          )}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
    />
  );
}

class EnhancedTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      order: "asc",
      orderBy: "sku",
      selected: [],
      data: [],
      page: 0,
      rowsPerPage: 10,
      loading: false,
      total_items: 0,
      openDialog: false,
      id: null,
      openEdit: false,
      // Product attribute
      product_name: '',
      product_code: '',
      category_id: null,
      price: '',
      weight: '',
      quantity: '',
      price_promote: '',
      start_date_promote: null,
      end_date_promote: null,
      length: '',
      height: '',
      width: '',
      description: '',
      image: '',
      video: '',
      product_link: '',
      ware_house: [
        {
          id: null,
          name: '',
          address: '',
          city_id: null,
          district_id: null,
          ward_id: null,
          is_used: null
        }
      ]
    };
  }


  componentDidMount() {
    this.getProducts();
  }

  getProducts = () => {
    let that = this;
    let { page, rowsPerPage } = this.state;
    const params = {
      product_code: '',
      product_name: '',
      price: '',
      quantity: '',
      category_name: '',
      page: (page + 1),
      page_size: rowsPerPage,
    }
    this.setState({ loading: true });
    APIFunction.queryProducts(params).then((result) => {

      that.setState({
        data: result.data.product,
        rowsPerPage: result.data.page_size,
        page: result.data.page - 1,
        total_items: result.data.total_items,
        loading: false,
      });
    }).catch(function (error) {
      // that.setState({ isOpen: true, errorMessage: error.message })
    });

  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = async (event, page) => {
    await this.setState({ page });
    this.getProducts();
  };

  handleChangeRowsPerPage = async event => {
    await this.setState({ rowsPerPage: event.target.value });
    this.getProducts();
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;


  onOpenBtnAction = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  onCloseBtnAction = () => {
    this.setState({ anchorEl: null });
  };

  handleDelete = (id) => {
    this.setState({
      anchorEl: null,
      openDialog: true,
      id: id
    });
  }


  handleCloseDialog(type) {
    if (type === 'ok') {
      APIFunction.removeProduct({ id: this.state.id }).then((result) => {
        this.setState({ openDialog: false, id: null });
        this.getProducts();
      }).catch(function (error) {
        // that.setState({ isOpen: true, errorMessage: error.message })
      });
    } else {
      this.setState({ openDialog: false });
    }

  }

  onSearch = (e) => {
    let that = this;
    let params = {
      search: e.target.value
    }
    this.setState({ loading: true });
    APIFunction.queryProducts(params).then((result) => {
      that.setState({
        data: result.data.product,
        rowsPerPage: result.data.page_size,
        page: result.data.page - 1,
        total_items: result.data.total_items,
        loading: false,
      });
    }).catch(function (error) {
      // that.setState({ isOpen: true, errorMessage: error.message })
    });
  }

  handleEdit = (id) => {
    let that = this;
    this.setState({
      anchorEl: null,
      id: id
    });
    if (id) {
      APIFunction.queryProduct({ id: id }).then(async (result) => {
        console.log(result);
        await that.setState({
          openEdit: true
        });
      }).catch(function (error) {
        // that.setState({ isOpen: true, errorMessage: error.message })
      });
    } else {
      this.setState({
        openEdit: true
      });
    }



  }

  handleClosEit = (type) => {
    if (type === 'submit') {
      APIFunction.removeProduct({ id: this.state.id }).then((result) => {
        this.setState({ openEdit: false });
        this.getProducts();
      }).catch(function (error) {
        // that.setState({ isOpen: true, errorMessage: error.message })
      });
    } else {
      this.setState({ openEdit: false });
    }
  }


  handleChangeNumber = type => e => {
    this.setState({ [type]: e.target.value });
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    })
  }


  render() {
    const { data, order, orderBy, selected, rowsPerPage, page, anchorEl,
      loading, total_items, openDialog, openEdit,
      id, product_name, product_code, price, quantity, weight, length, height, width } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    const options = [
      {
        value: 'fruits', label: 'Fruits',
        options: [
          {
            value: 'citrus', label: 'Citrus',
            options: [
              { value: 'orange', label: 'Orange' },
              { value: 'grapefruits', label: 'GrapeFruits' },
            ],
          },
          {
            value: 'tropical', label: 'Tropical',
            options: [
              { value: 'mango', label: 'Mango' },
              { value: 'papaya', label: 'Papaya' },
            ],
          },
          {
            value: 'berries', label: 'Berries',
            options: [
              { value: 'strawberry', label: 'Strawberry' },
              { value: 'raspberries', label: 'Raspberries' },
            ],
          },
        ],
      },
      {
        value: 'city', label: 'City',
        options: [
          { value: 'dublin', label: 'Dublin' },
          { value: 'new york', label: 'New York' },
          { value: 'san fransis', label: 'San Fransis' },
        ]
      }];


    return (
      <Card mb={6} >
        <Paper spacing={6}>
          <Grid
            style={{ marginTop: '10px' }}
            container
            direction="row"
            justify="flex-end"
            alignItems="center">
            <Tooltip title="Thêm mới" onClick={e => this.handleEdit(null)}>
              <Fab color="primary">
                <AddIcon />
              </Fab >
            </Tooltip>
          </Grid>
          <Grid container>
            <Grid item xs={12}>

              <TextField
                label="Tìm kiếm"
                variant="outlined"
                size="small"
                margin='dense'
                fullWidth
                onChange={this.onSearch}
              />
              <TableWrapper>
                <Table aria-labelledby="tableTitle">
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={this.handleSelectAllClick}
                    onRequestSort={this.handleRequestSort}
                    rowCount={total_items}
                  />
                  <TableBody>
                    {!loading ? stableSort(data, getSorting(order, orderBy))
                      .map(n => {
                        const isSelected = this.isSelected(n.id);
                        return (
                          <TableRow
                            hover
                            // onClick={event => this.handleClick(event, n.id)}
                            role="checkbox"
                            aria-checked={isSelected}
                            tabIndex={-1}
                            key={n.id}
                            selected={isSelected}
                          >
                            <TableCell component="th" scope="row" padding="none">
                              {n.product_code}
                            </TableCell>
                            <TableCell align="center">

                              < Avatar alt="Remy Sharp" srcSet={n.image} variant="square" /></TableCell>
                            <TableCell>{n.product_name}</TableCell>
                            <TableCell align="right">
                              <NumberFormat
                                value={n.price}
                                displayType={'text'}
                                thousandSeparator={true}
                                renderText={value => <div>{value}</div>} />
                            </TableCell>
                            <TableCell align="right">
                              <NumberFormat
                                value={n.quantity}
                                displayType={'text'}
                                thousandSeparator={true}
                                renderText={value => <div>{value}</div>} />
                            </TableCell>
                            <TableCell>{n.category_name}</TableCell>
                            <TableCell align="right">
                              <IconButton
                                aria-label="more"
                                aria-controls="long-menu"
                                aria-haspopup="true"
                                onClick={event => this.onOpenBtnAction(event)}
                              >
                                <MoreVertIcon />
                              </IconButton>
                              <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={this.onCloseBtnAction}
                              >
                                <MenuItem onClick={this.onCloseBtnAction}>
                                  <ListItemIcon fontSize="small">
                                    <FileCopy />
                                  </ListItemIcon >
                                  <ListItemText fontSize="small" primary="Sao chép" />
                                </MenuItem>
                                <MenuItem onClick={e => this.handleEdit(n.id)}>
                                  <ListItemIcon fontSize="small">
                                    <Edit />
                                  </ListItemIcon>
                                  <ListItemText fontSize="small" primary="Chỉnh sửa" />
                                </MenuItem>
                                <MenuItem onClick={e => this.handleDelete(n.id)}>
                                  <ListItemIcon fontSize="small">
                                    <DeleteOutline />
                                  </ListItemIcon>
                                  <ListItemText fontSize="small" primary="Xóa" />
                                </MenuItem>
                              </Menu>
                            </TableCell>
                          </TableRow>
                        );
                      }) :
                      <TableRow style={{ height: 23 * emptyRows }} >
                        <TableCell colSpan={8} style={{ textAlign: 'center' }}>
                          <Loading />
                        </TableCell>
                      </TableRow>}
                    {!loading > 0 && total_items == 0 ?
                      <TableRow style={{ height: 23 * emptyRows }}>
                        <TableCell colSpan={8} style={{ textAlign: 'center' }}>
                          <BlockTwoToneIcon />
                        </TableCell>
                      </TableRow> : null
                    }

                  </TableBody>
                </Table>
              </TableWrapper>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component="div"
                count={total_items}
                rowsPerPage={rowsPerPage}
                page={page}
                backIconButtonProps={{
                  "aria-label": "Trang trước"
                }}
                nextIconButtonProps={{
                  "aria-label": "Trang kế tiếp"
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </Grid>
          </Grid>
        </Paper>
        {/* Confirm delete */}
        <Dialog
          open={openDialog}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleCloseDialog}
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="xs" >
          <DialogTitle id="alert-dialog-slide-title">{"Xác nhận"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Bạn có chắc chắn muốn xóa phần tử này không ?
          </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={e => this.handleCloseDialog('cancel')} color="primary">Hủy</Button>
            <Button onClick={e => this.handleCloseDialog('ok')} color="primary">Đồng ý</Button>
          </DialogActions>
        </Dialog >

        {/* Modal create/edit */}

        < Dialog
          TransitionComponent={Transition}
          fullWidth={true}
          maxWidth={'lg'}
          open={openEdit}
          disableBackdropClick
          disableEscapeKeyDown
          onClose={e => this.handleClosEit('cancel')} >
          <DialogTitle id="max-width-dialog-title">{id ? "Chỉnh sửa" : "Tạo mới"}</DialogTitle>
          <DialogContent>
            <form noValidate>
              <ExpansionPanel expanded>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header">
                  <Typography >Thông tin cơ bản</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container spacing={3}>
                    <TextField
                      fullWidth
                      id="product_name"
                      name="product_name"
                      label="Tên sản phẩm"
                      value={product_name}
                      onChange={e => this.handleChange(e)}
                      variant="outlined"
                      required
                      // error
                      // helperText="Bắc buộc nhập"
                      margin="dense" />
                    <TextField
                      fullWidth
                      id="product_code"
                      name="product_code"
                      label="Mã sản phẩm"
                      value={product_code}
                      onChange={e => this.handleChange(e)}
                      variant="outlined"
                      margin="dense" />
                    <TextField
                      fullWidth
                      label="Giá bán"
                      value={price}
                      onChange={this.handleChangeNumber('price')}
                      id="price"
                      name="price"
                      variant="outlined"
                      margin="dense"
                      required
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                        endAdornment: (
                          <InputAdornment position="end">VND</InputAdornment>
                        ),
                      }} />
                    <TextField
                      fullWidth
                      label="Số lượng"
                      value={quantity}
                      onChange={this.handleChangeNumber('quantity')}
                      id="quantity"
                      name="quantity"
                      variant="outlined"
                      margin="dense"
                      required
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                      }} />

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Khối lượng"
                        value={weight}
                        onChange={this.handleChangeNumber('weight')}
                        id="weight"
                        name="weight"
                        variant="outlined"
                        margin="dense"
                        required
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                          endAdornment: (
                            <InputAdornment position="end">g</InputAdornment>
                          ),
                        }} />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        label="Dài"
                        value={length}
                        onChange={this.handleChangeNumber('length')}
                        id="length"
                        name="length"
                        variant="outlined"
                        margin="dense"
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                          endAdornment: (
                            <InputAdornment position="end">cm</InputAdornment>
                          ),
                        }} />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        label="Rộng"
                        value={width}
                        onChange={this.handleChangeNumber('width')}
                        id="width"
                        name="width"
                        variant="outlined"
                        margin="dense"
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                          endAdornment: (
                            <InputAdornment position="end">cm</InputAdornment>
                          ),
                        }} />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        label="Cao"
                        value={height}
                        onChange={this.handleChangeNumber('height')}
                        id="height"
                        name="height"
                        variant="outlined"
                        margin="dense"
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                          endAdornment: (
                            <InputAdornment position="end">cm</InputAdornment>
                          ),
                        }} />
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography>Thông tin thêm (Tùy chọn)</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                    sit amet blandit leo lobortis eget.
          </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel3a-content"
                  id="panel3a-header"
                >
                  <Typography>Thuộc tính sản phẩm (Tùy chọn)</Typography>
                </ExpansionPanelSummary>
              </ExpansionPanel>

            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={e => this.handleClosEit('cancel')} color="primary">Hủy</Button>
            <Button onClick={e => this.handleClosEit('submit')} color="primary">
              {id ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogActions>
        </Dialog >
      </Card >
    );
  }
}

function AdvancedTable() {
  return (
    <React.Fragment>
      <Typography variant="h3" gutterBottom display="block">
        Danh sách sản phẩm
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/dashboard">
          Trang chủ
        </Link>
        <Link component={NavLink} exact to="/product">
          Sản phẩm
        </Link>
        <Typography>Danh sách sản phẩm</Typography>
      </Breadcrumbs>

      <Divider spacing={4} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <EnhancedTable />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default AdvancedTable;
